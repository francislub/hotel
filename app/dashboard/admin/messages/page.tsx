"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Filter } from "lucide-react"

// Sample messages data
const messages = [
  {
    id: "1",
    sender: "John Smith",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    senderInitials: "JS",
    content: "I'd like to request a late checkout for tomorrow if possible.",
    timestamp: "Today at 10:30 AM",
    isRead: true,
    category: "Guest Request",
  },
  {
    id: "2",
    sender: "Sarah Johnson",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    senderInitials: "SJ",
    content: "Is room service available after midnight?",
    timestamp: "Today at 9:15 AM",
    isRead: false,
    category: "Guest Inquiry",
  },
  {
    id: "3",
    sender: "Michael Brown",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    senderInitials: "MB",
    content: "We need extra towels in room 302, please.",
    timestamp: "Yesterday at 8:45 PM",
    isRead: true,
    category: "Guest Request",
  },
  {
    id: "4",
    sender: "Emily Davis",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    senderInitials: "ED",
    content: "I'd like to book a spa appointment for tomorrow afternoon.",
    timestamp: "Yesterday at 3:20 PM",
    isRead: false,
    category: "Booking Request",
  },
  {
    id: "5",
    sender: "Robert Wilson",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    senderInitials: "RW",
    content: "Is there a gym in the hotel? What are the opening hours?",
    timestamp: "2 days ago at 11:10 AM",
    isRead: true,
    category: "Guest Inquiry",
  },
]

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState<(typeof messages)[0] | null>(null)
  const [replyText, setReplyText] = useState("")

  const filteredMessages =
    activeTab === "all"
      ? messages
      : activeTab === "unread"
        ? messages.filter((m) => !m.isRead)
        : messages.filter((m) => m.category.toLowerCase() === activeTab)

  const handleSelectMessage = (message: (typeof messages)[0]) => {
    setSelectedMessage(message)
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return
    // In a real app, you would send the reply to the API
    alert(`Reply sent: ${replyText}`)
    setReplyText("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search messages..." className="w-[200px] sm:w-[300px] pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-[calc(100vh-13rem)]">
            <CardHeader className="p-4">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="guest request">Requests</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0 overflow-auto h-[calc(100%-4rem)]">
              <div className="divide-y">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                      selectedMessage?.id === message.id ? "bg-muted" : ""
                    } ${!message.isRead ? "bg-primary/5" : ""}`}
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={message.senderAvatar} alt={message.sender} />
                        <AvatarFallback>{message.senderInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{message.sender}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{message.content}</p>
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className="text-xs">
                            {message.category}
                          </Badge>
                          {!message.isRead && <Badge className="ml-2 text-xs">New</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredMessages.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No messages found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedMessage ? (
            <Card className="h-[calc(100vh-13rem)] flex flex-col">
              <CardHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedMessage.senderAvatar} alt={selectedMessage.sender} />
                      <AvatarFallback>{selectedMessage.senderInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.sender}</CardTitle>
                      <CardDescription>{selectedMessage.timestamp}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{selectedMessage.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-1 overflow-auto">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p>{selectedMessage.content}</p>
                  </div>
                  {/* In a real app, you would show the message history here */}
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type your reply..."
                    className="min-h-[80px]"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-13rem)] flex items-center justify-center">
              <div className="text-center p-8">
                <h3 className="text-lg font-medium">Select a message</h3>
                <p className="text-muted-foreground mt-1">Choose a message from the list to view and reply</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

