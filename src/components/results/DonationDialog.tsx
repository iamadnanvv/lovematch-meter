import { HeartHandshake } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

interface DonationDialogProps {
  href: string;
  player1Name: string;
  player2Name: string;
}

export function DonationDialog({ href, player1Name, player2Name }: DonationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="love-button-outline w-full" type="button">
          <span className="flex items-center justify-center gap-2">
            <HeartHandshake className="h-5 w-5" />
            Support this experience
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">You two made this moment real</DialogTitle>
          <DialogDescription>
            If this felt special, help us keep Love Triangle beautifully alive—so more couples get to feel this kind of spark.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl bg-secondary p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{player1Name}</span> &{" "}
              <span className="font-semibold text-foreground">{player2Name}</span>,
              <br />
              this is your gentle nudge to say: “we invest in us.”
            </p>
          </div>

          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="gold-button w-full inline-flex items-center justify-center"
          >
            Open donation link
          </a>

          <p className="text-xs text-muted-foreground">
            No pressure—just appreciation. Thank you for supporting a more loving internet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
