import type { ComicScript } from '@/lib/comic'

function timestamp() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

export async function exportComicPdf(script: ComicScript, images: Record<number, string>) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 15
  const contentW = pageW - margin * 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.text(doc.splitTextToSize(script.title, contentW), pageW / 2, 60, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  const { characterName, setting, tone, artStyle } = script.request
  doc.text(`Starring ${characterName}`, pageW / 2, 90, { align: 'center' })
  doc.text(`${setting} · ${tone} · ${artStyle}`, pageW / 2, 98, { align: 'center' })
  doc.setFontSize(9)
  doc.text('Created with ComicCraft', pageW / 2, 280, { align: 'center' })

  for (const panel of script.panels) {
    doc.addPage()
    let y = margin + 5

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(`Panel ${panel.index + 1}: ${panel.title}`, margin, y)
    y += 6

    const image = images[panel.index]
    if (image) {
      const imgH = contentW * 0.75
      const format = image.includes('image/jpeg') ? 'JPEG' : 'PNG'
      doc.addImage(image, format, margin, y, contentW, imgH)
      doc.setLineWidth(1)
      doc.rect(margin, y, contentW, imgH)
      y += imgH + 8
    }

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(11)
    const narration = doc.splitTextToSize(panel.narration, contentW)
    doc.text(narration, margin, y)
    y += narration.length * 5 + 4

    doc.setFont('helvetica', 'normal')
    for (const line of panel.dialogue) {
      const wrapped = doc.splitTextToSize(`${line.speaker}: "${line.line}"`, contentW)
      doc.text(wrapped, margin, y)
      y += wrapped.length * 5 + 2
    }
  }

  doc.save(`comic_${timestamp()}.pdf`)
}
