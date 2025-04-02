import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MessageSquare, HelpCircle } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support & Help</h1>
        <p className="text-muted-foreground mt-2">Get assistance with any questions or issues during your stay.</p>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" /> Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">For immediate assistance, please call our front desk.</p>
                <p className="font-medium mt-2">Dial 0 from your room</p>
                <p className="text-sm text-muted-foreground">Available 24/7</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" /> Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Send us an email for non-urgent inquiries.</p>
                <p className="font-medium mt-2">support@crownhotel.com</p>
                <p className="text-sm text-muted-foreground">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" /> Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Chat with our guest services team.</p>
                <p className="font-medium mt-2">Use the chat icon in the app</p>
                <p className="text-sm text-muted-foreground">Available 8:00 AM - 10:00 PM</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
              <CardDescription>Send us a message and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="Subject of your message" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Your message" rows={5} />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Send Message</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about your stay.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What are the check-in and check-out times?</AccordionTrigger>
                  <AccordionContent>
                    Check-in time is 3:00 PM and check-out time is 12:00 PM. Early check-in and late check-out may be
                    available upon request, subject to availability and additional charges.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is breakfast included in my stay?</AccordionTrigger>
                  <AccordionContent>
                    Breakfast inclusion depends on your room package. You can check your booking details or contact the
                    front desk to confirm if breakfast is included in your stay.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is there free Wi-Fi in the hotel?</AccordionTrigger>
                  <AccordionContent>
                    Yes, complimentary high-speed Wi-Fi is available throughout the hotel for all guests.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Do you offer airport transfers?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer airport transfers for an additional fee. Please contact the concierge at least 24
                    hours in advance to arrange transportation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>What amenities are available in the hotel?</AccordionTrigger>
                  <AccordionContent>
                    Our hotel features a swimming pool, fitness center, spa, multiple dining options, business center,
                    and concierge services. For a complete list of amenities, please visit the Services section in your
                    guest portal.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="mt-6">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <HelpCircle className="h-5 w-5" /> Emergency Information
              </CardTitle>
              <CardDescription>Important contacts and procedures for emergencies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Medical Emergency</h3>
                <p className="text-sm">Dial 911 from your room phone or contact the front desk by dialing 0.</p>
              </div>
              <div>
                <h3 className="font-medium">Security</h3>
                <p className="text-sm">For security concerns, dial extension 7000 from your room phone.</p>
              </div>
              <div>
                <h3 className="font-medium">Fire Emergency</h3>
                <p className="text-sm">
                  In case of fire, please use the nearest emergency exit. Emergency exit maps are located on the back of
                  your room door.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Local Emergency Services</h3>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Police: 911</li>
                  <li>Fire Department: 911</li>
                  <li>Ambulance: 911</li>
                  <li>Nearest Hospital: City General Hospital (2.5 miles)</li>
                  <li>Pharmacy: Hotel Pharmacy (Lobby Level) or City Pharmacy (0.5 miles)</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive">Call Front Desk</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

