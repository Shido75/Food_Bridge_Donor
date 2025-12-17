"use client"

import type { Profile } from "@/lib/types/database"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { useState } from "react"
import { CheckCircleIcon, XCircleIcon, SearchIcon } from "lucide-react"

interface UserManagementTableProps {
  users: Profile[]
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRoleColor = (role: string) => {
    const colors = {
      donor: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      ngo: "bg-purple-500/10 text-purple-700 border-purple-500/20",
      delivery_partner: "bg-orange-500/10 text-orange-700 border-orange-500/20",
      admin: "bg-red-500/10 text-red-700 border-red-500/20",
    }
    return colors[role as keyof typeof colors] || colors.donor
  }

  const getRoleLabel = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <SearchIcon className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.is_active ? (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircleIcon className="h-4 w-4" />
                        Active
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-sm text-red-600">
                        <XCircleIcon className="h-4 w-4" />
                        Inactive
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(user.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
