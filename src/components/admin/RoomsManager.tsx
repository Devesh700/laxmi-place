"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteRoomAction,
  deleteStorageImageAction,
  reorderRoomAction,
  saveRoomAction,
  toggleRoomActiveAction,
  uploadRoomImageAction,
} from "@/app/admin/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Room, RoomImage } from "@/types/room";

async function resizeImageClient(file: File, maxDim = 1600): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  if (scale >= 1) return file;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85)
  );
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
}

interface RoomDraft {
  id?: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  pricePerNight: string;
  capacity: string;
  bedType: string;
  sizeSqFt: string;
  amenitiesCsv: string;
  totalUnits: string;
  isActive: boolean;
  sortOrder: string;
  images: RoomImage[];
}

const emptyDraft = (nextOrder: number): RoomDraft => ({
  name: "",
  slug: "",
  description: "",
  type: "Deluxe",
  pricePerNight: "2500",
  capacity: "2",
  bedType: "Queen Bed",
  sizeSqFt: "250",
  amenitiesCsv: "Free Wi-Fi, Air Conditioning, LED TV",
  totalUnits: "2",
  isActive: true,
  sortOrder: String(nextOrder),
  images: [],
});

export function RoomsManager({
  initialRooms,
  configured,
}: {
  initialRooms: Room[];
  configured: boolean;
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<RoomDraft>(() => emptyDraft(initialRooms.length + 1));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);

  const openNew = () => {
    setDraft(emptyDraft(initialRooms.length + 1));
    setDialogOpen(true);
  };

  const openEdit = (room: Room) => {
    setDraft({
      id: room.id,
      name: room.name,
      slug: room.slug,
      description: room.description,
      type: room.type,
      pricePerNight: String(room.pricePerNight),
      capacity: String(room.capacity),
      bedType: room.bedType,
      sizeSqFt: String(room.sizeSqFt),
      amenitiesCsv: room.amenities.join(", "),
      totalUnits: String(room.totalUnits),
      isActive: room.isActive,
      sortOrder: String(room.sortOrder),
      images: room.images,
    });
    setDialogOpen(true);
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          toast.error(`${file.name}: Only JPEG, PNG, or WebP allowed.`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: Must be <= 5MB.`);
          continue;
        }
        const resized = await resizeImageClient(file, 1600);
        const fd = new FormData();
        fd.append("file", resized);
        fd.append("alt", draft.name || "Hotel room photo");
        const res = await uploadRoomImageAction(fd);
        if (res.ok && res.image) {
          setDraft((prev) => ({ ...prev, images: [...prev.images, res.image!] }));
          toast.success(`Uploaded ${file.name}`);
        } else {
          toast.error(res.error ?? "Upload failed");
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (img: RoomImage) => {
    await deleteStorageImageAction(img.path);
    setDraft((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i.url !== img.url),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const amenities = draft.amenitiesCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await saveRoomAction({
        id: draft.id,
        name: draft.name,
        slug:
          draft.slug ||
          draft.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
        description: draft.description,
        type: draft.type,
        pricePerNight: Number(draft.pricePerNight),
        capacity: Number(draft.capacity),
        bedType: draft.bedType,
        sizeSqFt: Number(draft.sizeSqFt),
        amenities,
        totalUnits: Number(draft.totalUnits),
        isActive: draft.isActive,
        sortOrder: Number(draft.sortOrder),
        images: draft.images,
      });

      if (res.ok) {
        toast.success(draft.id ? "Room updated" : "Room created");
        setDialogOpen(false);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to save room");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (room: Room, next: boolean) => {
    const res = await toggleRoomActiveAction(room.id, next, room.slug);
    if (res.ok) {
      toast.success(`${room.name} ${next ? "enabled" : "disabled"}`);
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to update status");
    }
  };

  const handleReorder = async (room: Room, delta: number) => {
    const res = await reorderRoomAction(room.id, Math.max(0, room.sortOrder + delta));
    if (res.ok) {
      router.refresh();
    } else {
      toast.error(res.error ?? "Reorder failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteRoomAction(deleteTarget.id, deleteTarget.images, deleteTarget.slug);
    if (res.ok) {
      toast.success(`Deleted ${deleteTarget.name}`);
      setDeleteTarget(null);
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to delete room");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-text">
            Inventory
          </p>
          <h1 className="font-heading text-3xl font-bold text-foreground">Rooms</h1>
        </div>
        <Button type="button" onClick={openNew} disabled={!configured}>
          <Plus className="size-4" />
          <span>Add Room</span>
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-2xl border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Tariff</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialRooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No rooms in Firestore yet. Add a room or run the seed script.
                </TableCell>
              </TableRow>
            ) : (
              initialRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{room.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {room.type} · {room.capacity} guests
                    </div>
                  </TableCell>
                  <TableCell>₹{room.pricePerNight.toLocaleString("en-IN")}</TableCell>
                  <TableCell>{room.totalUnits}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Move up"
                        onClick={() => handleReorder(room, -1)}
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <span className="w-5 text-center text-xs">{room.sortOrder}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Move down"
                        onClick={() => handleReorder(room, 1)}
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={room.isActive}
                      onCheckedChange={(v) => handleToggle(room, v)}
                      aria-label={`Toggle ${room.name}`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-sm" aria-label="Room actions" />}
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(room)}>
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteTarget(room)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {initialRooms.map((room) => (
          <Card key={room.id}>
            <CardContent className="space-y-3 pt-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading text-xl font-semibold">{room.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{room.pricePerNight.toLocaleString("en-IN")} / night · {room.totalUnits} units
                  </p>
                </div>
                <Badge variant={room.isActive ? "default" : "secondary"}>
                  {room.isActive ? "Active" : "Hidden"}
                </Badge>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <Switch
                  checked={room.isActive}
                  onCheckedChange={(v) => handleToggle(room, v)}
                  aria-label={`Toggle ${room.name}`}
                />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEdit(room)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(room)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              {draft.id ? "Edit Room" : "Add Room"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="r-name">Room Name</Label>
                <Input
                  id="r-name"
                  required
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r-slug">URL Slug</Label>
                <Input
                  id="r-slug"
                  placeholder="auto-generated-if-empty"
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="r-desc">Description</Label>
              <Textarea
                id="r-desc"
                required
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="r-type">Type</Label>
                <Input
                  id="r-type"
                  required
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r-price">Price / Night (INR)</Label>
                <Input
                  id="r-price"
                  type="number"
                  required
                  value={draft.pricePerNight}
                  onChange={(e) => setDraft({ ...draft, pricePerNight: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r-units">Total Units</Label>
                <Input
                  id="r-units"
                  type="number"
                  required
                  value={draft.totalUnits}
                  onChange={(e) => setDraft({ ...draft, totalUnits: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="r-cap">Max Guests</Label>
                <Input
                  id="r-cap"
                  type="number"
                  required
                  value={draft.capacity}
                  onChange={(e) => setDraft({ ...draft, capacity: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r-bed">Bed Type</Label>
                <Input
                  id="r-bed"
                  required
                  value={draft.bedType}
                  onChange={(e) => setDraft({ ...draft, bedType: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r-size">Size (sq ft)</Label>
                <Input
                  id="r-size"
                  type="number"
                  required
                  value={draft.sizeSqFt}
                  onChange={(e) => setDraft({ ...draft, sizeSqFt: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="r-amen">Amenities (comma separated)</Label>
              <Input
                id="r-amen"
                value={draft.amenitiesCsv}
                onChange={(e) => setDraft({ ...draft, amenitiesCsv: e.target.value })}
              />
            </div>

            {/* Image uploader */}
            <div className="space-y-2">
              <Label>Room Photos (JPEG/PNG/WebP, max 5MB)</Label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground hover:border-primary">
                <Upload className="size-4" />
                <span>{uploading ? "Uploading..." : "Click to upload room photos"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
              </label>

              {draft.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                  {draft.images.map((img) => (
                    <div
                      key={img.url}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border"
                    >
                      <Image src={img.url} alt={img.alt} fill sizes="120px" className="object-cover" />
                      <button
                        type="button"
                        aria-label="Remove image"
                        onClick={() => handleRemoveImage(img)}
                        className="absolute top-1 right-1 inline-flex size-6 items-center justify-center rounded-full bg-black/70 text-white"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="r-active"
                  checked={draft.isActive}
                  onCheckedChange={(v) => setDraft({ ...draft, isActive: v })}
                />
                <Label htmlFor="r-active">Visible on public website</Label>
              </div>
              <Button type="submit" disabled={saving || uploading}>
                {saving ? "Saving..." : "Save Room"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the room and its uploaded Storage photos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
