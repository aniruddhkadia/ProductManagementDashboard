import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { userService } from "@/services/user.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import type { User } from "@/types/user.types";

export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const limit = 10;
  const debouncedSearch = useDebounce(search, 300);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["users", page, debouncedSearch],
    queryFn: () => userService.getAll(limit, (page - 1) * limit),
  });

  const handleSearch = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set("search", val);
    else newParams.delete("search");
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const totalPages = Math.ceil((usersData?.total || 0) / limit);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Users</h1>

      <div className="flex items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell
                    colSpan={6}
                    className="h-12 animate-pulse bg-muted/50"
                  />
                </TableRow>
              ))
            ) : usersData?.users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              usersData?.users.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedUser(user)}
                >
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.firstName} />
                      <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.company.name}</TableCell>
                  <TableCell>{user.address.city}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, usersData?.total || 0)} of{" "}
          {usersData?.total || 0}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="flex flex-col items-center gap-6 py-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedUser.image} />
                <AvatarFallback>{selectedUser.firstName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-bold">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-muted-foreground">
                  {selectedUser.company.title} at {selectedUser.company.name}
                </p>
              </div>
              <div className="w-full grid grid-cols-1 gap-4 text-sm divide-y border-t pt-4">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{selectedUser.phone}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-medium text-right max-w-[200px]">
                    {selectedUser.address.address}, {selectedUser.address.city}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
