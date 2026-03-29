'use client'

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function NavigationBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              SEFGH-AI
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">sefgh v1</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Versions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/versions">sefgh v1</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/versions">v2 (preview)</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/versions">v3 (preview)</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button variant="outline" asChild>
            <Link href="/login">Login / Signup</Link>
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button variant="outline" asChild>
            <Link href="/search">GitHub Search</Link>
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button asChild>
            <Link href="/chat">Private Chat</Link>
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
