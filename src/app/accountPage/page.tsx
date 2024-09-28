"use client"

import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bike, Flame, Zap } from "lucide-react"

export default function AccountPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="w-24 h-24">
          <AvatarImage src="/path-to-profile-image.jpg" alt="Profile" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">John Doe</h1>
        <p className="text-gray-500">@johndoe</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-2 p-2 bg-blue-100 rounded-full">
                <Bike className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-bold">13 km</p>
              <p className="text-sm text-gray-500">Total Distance</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 p-2 bg-green-100 rounded-full">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-bold">15 days</p>
              <p className="text-sm text-gray-500">Current Streak</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 p-2 bg-orange-100 rounded-full">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-bold">996 kcal</p>
              <p className="text-sm text-gray-500">Calories Burned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Email" />
          <Input placeholder="Phone Number" />
          <Input placeholder="Emergency Contact" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cycling Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Type of Bike" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal Bike</SelectItem>
              <SelectItem value="mountain">Mountain Bike</SelectItem>
              <SelectItem value="electric">Electric Bike</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Cycling Goals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="leisure">Leisure</SelectItem>
              <SelectItem value="commuting">Commuting</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health & Safety</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Medical Conditions" />
          <Input placeholder="Allergies" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Blood Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Home Address" />
          <div>
            <h3 className="text-sm font-medium mb-2">Saved Locations</h3>
            {/* Add logic to display saved locations here */}
            <Button variant="outline" className="w-full">+ Add New Location</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
