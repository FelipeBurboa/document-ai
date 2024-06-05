"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateNoteForm from "./create-note-form";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CreateNoteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <PlusIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>
            Type what ever note you want to be searchable later on
          </DialogDescription>
          <CreateNoteForm
            onNoteCreated={() => {
              setIsOpen(false);
              toast({
                title: "Note created",
                description: "Your note has been created successfully.",
              });
            }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
