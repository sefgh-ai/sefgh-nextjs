'use client'

import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Link href="/" className="font-bold text-lg">
          SEFGH-AI
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">sefgh v1</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Versions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>sefgh v1</DropdownMenuItem>
            <DropdownMenuItem>v2</DropdownMenuItem>
            <DropdownMenuItem>v3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline">Login/Signup</Button>
        <Button variant="outline">GitHub Search</Button>
        <Button>Private Chat</Button>
      </div>
    </header>
  )
}
