import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function DocumentCard({ document }: { document: Doc<"documents"> }) {
  return (
    <Card key={document._id} className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{document.title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {document.description ? (
          <p>{document.description}</p>
        ) : (
          new Array(4).fill(0).map((_, i) => (
            <div className="p-2">
              <Skeleton className="h-[25px] rounded-sm w-full" />
            </div>
          ))
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="secondary">
          <Link href={`/dashboard/documents/${document._id}`}>
            <EyeIcon className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
