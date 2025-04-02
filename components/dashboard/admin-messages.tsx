"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Filter, RefreshCcw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format, formatDistanceToNow } from "date-fns"
import { markMessageAsRead, replyToMessage, getMessageThread } from "@/lib/actions/message-actions"

type Message = {
  id: string
  sender: string
  senderId: string
  senderEmail: string
  senderAvatar: string
  senderInitials: string
  recipient: string
  recipientId: string
  content: string
  timestamp: string
  isRead: boolean
  category: string
  isParent?: boolean
}

interface AdminMessagesProps {
  messages: Message[]
}

export function AdminMessages({ messages: initialMessages }: AdminMessagesProps) {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [messageThread, setMessageThread] = useState<Message[]>([])
  const [replyText, setReplyText] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  const filteredMessages = messages
    .filter((message) => {
      if (searchTerm) {
        return (
          message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      return true
    })
    .filter((message) => {
      if (activeTab === "all") return true
      if (activeTab === "unread") return !message.isRead
      return message.category.toLowerCase() === activeTab.toLowerCase()
    })

  useEffect(() => {
    if (selectedMessageId) {
      loadMessageThread(selectedMessageId)
    }
  }, [selectedMessageId])

  const loadMessageThread = async (messageId: string) => {
    setIsLoading(true)
    try {
      const result = await getMessageThread(messageId)
      if (result.success) {
        setMessageThread(result.data)

        // Mark the message as read if it's not already
        const selectedMessage = messages.find((m) => m.id === messageId)
        if (selectedMessage && !selectedMessage.isRead) {
          await markMessageAsRead(messageId)
          // Update the messages list to reflect the read status
          setMessages((prevMessages) =>
            prevMessages.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg)),
          )
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load message thread",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading message thread:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessageId(messageId)
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessageId || !session?.user?.id) return

    setIsLoading(true)
    try {
      const result = await replyToMessage(selectedMessageId, session.user.id, replyText)

      if (result.success) {
        toast({
          title: "Reply Sent",
          description: "Your message has been sent successfully.",
        })
        setReplyText("")

        // Reload the message thread to include the new reply
        await loadMessageThread(selectedMessageId)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send reply",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatMessageContent = (content: string) => {
    // Check if the content has a subject line
    if (content.startsWith("Subject:")) {
      const parts = content.split("\n\n")
      if (parts.length >= 2) {
        const subject = parts[0].replace("Subject:", "").trim()
        const message = parts.slice(1).join("\n\n")
        return (
          <>
            <h3 className="font-medium mb-2">{subject}</h3>
            <p className="whitespace-pre-wrap">{message}</p>
          </>
        )
      }
    }

    // If no subject format is detected, just return the content
    return <p className="whitespace-pre-wrap">{content}</p>
  }

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, " ")
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="w-[200px] sm:w-[300px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-[calc(100vh-13rem)]">
            <CardHeader className="p-4">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="GENERAL_INQUIRY">Inquiries</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0 overflow-auto h-[calc(100%-4rem)]">
              <div className="divide-y">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No messages found</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                        selectedMessageId === message.id ? "bg-muted" : ""
                      } ${!message.isRead ? "bg-primary/5" : ""}`}
                      onClick={() => handleSelectMessage(message.id)}
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
                              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {message.content.replace("Subject:", "")}
                          </p>
                          <div className="flex items-center mt-2">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(message.category)}
                            </Badge>
                            {!message.isRead && <Badge className="ml-2 text-xs">New</Badge>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedMessageId ? (
            <Card className="h-[calc(100vh-13rem)] flex flex-col">
              <CardHeader className="p-4 border-b">
                {messageThread.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={messageThread[0].senderAvatar} alt={messageThread[0].sender} />
                        <AvatarFallback>{messageThread[0].senderInitials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{messageThread[0].sender}</CardTitle>
                        <CardDescription>{format(new Date(messageThread[0].timestamp), "PPP 'at' p")}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{getCategoryLabel(messageThread[0].category)}</Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4 flex-1 overflow-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading message thread...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messageThread.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg ${
                          message.senderId === session?.user?.id
                            ? "bg-primary text-primary-foreground ml-8"
                            : "bg-muted mr-8"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{message.sender}</span>
                          <span className="text-xs opacity-80">{format(new Date(message.timestamp), "p")}</span>
                        </div>
                        {formatMessageContent(message.content)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type your reply..."
                    className="min-h-[80px]"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendReply} disabled={!replyText.trim() || isLoading}>
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
    </>
  )
}

