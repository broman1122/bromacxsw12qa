import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

function generateOrderNumber(): string {
  const now = new Date()
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "")
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `TG${datePart}${randomPart}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerName, customerPhone, items, totalAmount, paymentMethod, notes } = body

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Fyll i alla obligatoriska fält" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const orderNumber = generateOrderNumber()

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        items: items,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        payment_status: paymentMethod === "kassa" ? "pending" : "pending",
        order_status: "pending",
        notes: notes || null
      })
      .select()
      .single()

    if (error) {
      console.error("Order creation error:", error)
      return NextResponse.json(
        { success: false, error: "Kunde inte skapa beställning" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      orderNumber: orderNumber,
      orderId: data.id
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { success: false, error: "Serverfel" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Fetch orders error:", error)
      return NextResponse.json(
        { success: false, error: "Kunde inte hämta beställningar" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, orders: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { success: false, error: "Serverfel" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { orderId, orderStatus, paymentStatus } = body

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID krävs" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    const updateData: Record<string, string> = { updated_at: new Date().toISOString() }
    if (orderStatus) updateData.order_status = orderStatus
    if (paymentStatus) updateData.payment_status = paymentStatus

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)

    if (error) {
      console.error("Update order error:", error)
      return NextResponse.json(
        { success: false, error: "Kunde inte uppdatera beställning" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { success: false, error: "Serverfel" },
      { status: 500 }
    )
  }
}
