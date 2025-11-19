import jsPDF from 'jspdf'
import { toast } from 'sonner'

interface ScanResult {
    success: boolean
    scan_id: string
    disease: string
    confidence: number
    severity: 'None' | 'Mild' | 'Moderate' | 'Severe'
    description: string
    symptoms: string[]
    treatment: string[]
    prevention: string[]
    organic_treatment: string[]
    cost_estimate: string
    scientific_name: string
    image_url: string
    timestamp: string
    crop_type: string
}

export async function downloadReportAsPDF(result: ScanResult) {
    try {
        toast.loading('Generating PDF report...')

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 15
        let yPosition = margin

        // Header
        pdf.setFontSize(24)
        pdf.setTextColor(34, 139, 34)
        pdf.text('CropGuard AI', margin, yPosition)
        yPosition += 10

        pdf.setFontSize(18)
        pdf.setTextColor(0, 0, 0)
        pdf.text('Disease Detection Report', margin, yPosition)
        yPosition += 12

        // Scan Details
        pdf.setFontSize(12)
        pdf.setTextColor(100, 100, 100)
        pdf.text(`Date: ${new Date(result.timestamp).toLocaleDateString()}`, margin, yPosition)
        yPosition += 6
        pdf.text(`Scan ID: ${result.scan_id}`, margin, yPosition)
        yPosition += 10

        // Disease Information
        pdf.setFontSize(16)
        pdf.setTextColor(0, 0, 0)
        pdf.text('Disease Detected', margin, yPosition)
        yPosition += 8

        pdf.setFontSize(14)
        pdf.setTextColor(220, 38, 38)
        pdf.text(result.disease, margin, yPosition)
        yPosition += 6

        pdf.setFontSize(10)
        pdf.setTextColor(100, 100, 100)
        pdf.text(`Scientific Name: ${result.scientific_name}`, margin, yPosition)
        yPosition += 10

        // Confidence & Severity
        pdf.setFontSize(12)
        pdf.setTextColor(0, 0, 0)
        pdf.text(`Confidence: ${result.confidence}%`, margin, yPosition)
        pdf.text(`Severity: ${result.severity}`, pageWidth / 2, yPosition)
        yPosition += 10

        // Description
        pdf.setFontSize(14)
        pdf.text('Description', margin, yPosition)
        yPosition += 6
        pdf.setFontSize(10)
        const descLines = pdf.splitTextToSize(result.description, pageWidth - 2 * margin)
        pdf.text(descLines, margin, yPosition)
        yPosition += descLines.length * 5 + 8

        // Symptoms
        if (yPosition > pageHeight - 60) {
            pdf.addPage()
            yPosition = margin
        }
        pdf.setFontSize(14)
        pdf.text('Symptoms', margin, yPosition)
        yPosition += 6
        pdf.setFontSize(10)
        result.symptoms.forEach((symptom) => {
            if (yPosition > pageHeight - 20) {
                pdf.addPage()
                yPosition = margin
            }
            const symptomLines = pdf.splitTextToSize(`• ${symptom}`, pageWidth - 2 * margin - 5)
            pdf.text(symptomLines, margin + 2, yPosition)
            yPosition += symptomLines.length * 5
        })
        yPosition += 8

        // Treatment
        if (yPosition > pageHeight - 60) {
            pdf.addPage()
            yPosition = margin
        }
        pdf.setFontSize(14)
        pdf.text('Treatment Recommendations', margin, yPosition)
        yPosition += 6
        pdf.setFontSize(10)
        result.treatment.forEach((treatment, index) => {
            if (yPosition > pageHeight - 20) {
                pdf.addPage()
                yPosition = margin
            }
            const treatmentLines = pdf.splitTextToSize(`${index + 1}. ${treatment}`, pageWidth - 2 * margin - 5)
            pdf.text(treatmentLines, margin + 2, yPosition)
            yPosition += treatmentLines.length * 5
        })
        yPosition += 8

        // Prevention
        if (yPosition > pageHeight - 60) {
            pdf.addPage()
            yPosition = margin
        }
        pdf.setFontSize(14)
        pdf.text('Prevention Measures', margin, yPosition)
        yPosition += 6
        pdf.setFontSize(10)
        result.prevention.forEach((prevention, index) => {
            if (yPosition > pageHeight - 20) {
                pdf.addPage()
                yPosition = margin
            }
            const preventionLines = pdf.splitTextToSize(`${index + 1}. ${prevention}`, pageWidth - 2 * margin - 5)
            pdf.text(preventionLines, margin + 2, yPosition)
            yPosition += preventionLines.length * 5
        })
        yPosition += 8

        // Cost Estimate
        if (yPosition > pageHeight - 30) {
            pdf.addPage()
            yPosition = margin
        }
        pdf.setFontSize(14)
        pdf.text('Cost Estimate', margin, yPosition)
        yPosition += 6
        pdf.setFontSize(12)
        pdf.setTextColor(34, 139, 34)
        pdf.text(result.cost_estimate, margin, yPosition)

        // Footer
        pdf.setFontSize(8)
        pdf.setTextColor(150, 150, 150)
        pdf.text('Generated by CropGuard AI - Protecting Your Crops with AI Technology', margin, pageHeight - 10)

        // Save PDF
        pdf.save(`cropguard-report-${result.scan_id}.pdf`)
        toast.dismiss()
        toast.success('Report downloaded successfully!')
    } catch (error) {
        console.error('PDF generation error:', error)
        toast.dismiss()
        toast.error('Failed to generate PDF report')
    }
}

export function copyReportLink(result: ScanResult) {
    const shareText = `CropGuard AI Disease Detection Report\n\nDisease: ${result.disease}\nConfidence: ${result.confidence}%\nSeverity: ${result.severity}\nCrop: ${result.crop_type}\n\nView full report at: ${window.location.origin}/dashboard/history?scan=${result.scan_id}`

    navigator.clipboard.writeText(shareText).then(() => {
        toast.success('Report summary copied to clipboard!')
    }).catch(() => {
        toast.error('Failed to copy to clipboard')
    })
}

export function shareViaEmail(result: ScanResult) {
    const subject = encodeURIComponent(`CropGuard AI Report - ${result.disease} Detected`)
    const body = encodeURIComponent(
        `Disease Detection Report\n\n` +
        `Disease: ${result.disease}\n` +
        `Scientific Name: ${result.scientific_name}\n` +
        `Confidence: ${result.confidence}%\n` +
        `Severity: ${result.severity}\n` +
        `Crop Type: ${result.crop_type}\n\n` +
        `Description: ${result.description}\n\n` +
        `Treatment: ${result.treatment.slice(0, 2).join(', ')}...\n\n` +
        `View full report at: ${window.location.origin}/dashboard/history?scan=${result.scan_id}`
    )

    window.location.href = `mailto:?subject=${subject}&body=${body}`
}

export function shareOnSocial(result: ScanResult, platform: 'twitter' | 'facebook' | 'whatsapp') {
    const shareUrl = `${window.location.origin}/dashboard/history?scan=${result.scan_id}`
    const shareText = `CropGuard AI detected ${result.disease} in my ${result.crop_type} crop with ${result.confidence}% confidence. Severity: ${result.severity}`

    let url = ''
    switch (platform) {
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
            break
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
            break
        case 'whatsapp':
            url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
            break
    }

    window.open(url, '_blank', 'width=600,height=400')
}

export async function shareViaWebAPI(result: ScanResult) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: `CropGuard AI - ${result.disease} Detected`,
                text: `Disease: ${result.disease}\nConfidence: ${result.confidence}%\nSeverity: ${result.severity}`,
                url: `${window.location.origin}/dashboard/history?scan=${result.scan_id}`
            })
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                toast.error('Failed to share')
            }
        }
    } else {
        toast.error('Web Share API not supported on this device')
    }
}
