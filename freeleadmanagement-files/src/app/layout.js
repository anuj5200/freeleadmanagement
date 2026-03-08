export const metadata = {
  title: 'FreeLeadManagement - CRM',
  description: 'WhatsApp-First Lead Management CRM',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0,padding:0,background:'#0a0e1a'}}>{children}</body>
    </html>
  )
}
