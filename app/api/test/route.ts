export async function GET() {
  // Keep this endpoint harmless. A GET endpoint must never create accounts.
  return Response.json({ message: "API is reachable" })
}
