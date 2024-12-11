"use client";

import { Button } from "@/app/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/Components/ui/table";
import { CreateUserDialog } from "@/app/(users)/Admin/Components/admin/create-user-dialog";
import { useEffect, useState } from "react";
import { UserPlus, PenSquare, Trash2 } from "lucide-react";
import { Badge } from "@/app/Components/ui/badge";
import { fetchUniversityUsersArray } from "@/app/lib/actions";
import { UserStatus, UserType } from "@prisma/client";

// const users = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "john.doe@university.edu",
//     role: "DEAN",
//     school: "School of Computing",
//     status: "active",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     email: "jane.smith@university.edu",
//     role: "LECTURER",
//     school: "School of Computing",
//     status: "active",
//   },
// ];

interface Users {
  id: number;
  name: string;
  email: string;
  userType: UserType;
  userStatus: UserStatus;
  school: string;
}
export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<Users[]>([]);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  }
  useEffect(() => {
    const handleUsers = async () => {
      try{
        const users = await fetchUniversityUsersArray();
        setUsers(users || []);
      }catch(error){
        console.error('Error fetching users', error);
      }
    }
    handleUsers();
  },[]);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage system users and their roles
          </p>
        </div>
        <Button onClick={() => handleOpen()}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.userType}</Badge>
                  </TableCell>
                  <TableCell>{user.school}</TableCell>
                  <TableCell>
                    <Badge variant="success">{user.userStatus}</Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <PenSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateUserDialog open={open} /*onOpenChange={setOpen}*/ />
    </div>
  );
}