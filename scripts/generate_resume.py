from pathlib import Path
from shutil import copyfile

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PDF = ROOT / "output" / "pdf" / "Xiao-Chuyu-Resume.pdf"
PUBLIC_PDF = ROOT / "public" / "resume" / "Xiao-Chuyu-Resume.pdf"

BLUE = colors.HexColor("#0B5A97")
TEAL = colors.HexColor("#087F8C")
INK = colors.HexColor("#111827")
MUTED = colors.HexColor("#46546B")
RULE = colors.HexColor("#B8C8D8")


def register_fonts():
    font_dir = Path("C:/Windows/Fonts")
    pdfmetrics.registerFont(TTFont("ResumeSerif", font_dir / "times.ttf"))
    pdfmetrics.registerFont(TTFont("ResumeSerif-Bold", font_dir / "timesbd.ttf"))
    pdfmetrics.registerFont(TTFont("ResumeSerif-Italic", font_dir / "timesi.ttf"))
    pdfmetrics.registerFont(TTFont("ResumeSans", font_dir / "arial.ttf"))
    pdfmetrics.registerFont(TTFont("ResumeSans-Bold", font_dir / "arialbd.ttf"))


register_fonts()

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="ResumeName",
        fontName="ResumeSerif-Bold",
        fontSize=26,
        leading=28,
        textColor=INK,
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeRole",
        fontName="ResumeSans-Bold",
        fontSize=10.4,
        leading=13,
        textColor=TEAL,
        spaceAfter=3,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeContact",
        fontName="ResumeSerif",
        fontSize=9.4,
        leading=11.5,
        textColor=MUTED,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeSummary",
        fontName="ResumeSerif",
        fontSize=9.6,
        leading=12.1,
        textColor=MUTED,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeSection",
        fontName="ResumeSerif-Bold",
        fontSize=13.8,
        leading=16,
        textColor=BLUE,
        spaceBefore=3,
        spaceAfter=0,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeEntryTitle",
        fontName="ResumeSerif-Bold",
        fontSize=10.7,
        leading=12.5,
        textColor=INK,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeDate",
        fontName="ResumeSerif-Bold",
        fontSize=9.6,
        leading=12,
        textColor=MUTED,
        alignment=TA_RIGHT,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeRoleItalic",
        fontName="ResumeSerif-Italic",
        fontSize=9.5,
        leading=11.5,
        textColor=MUTED,
        spaceAfter=1,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeBody",
        fontName="ResumeSerif",
        fontSize=9.35,
        leading=11.45,
        textColor=INK,
        alignment=TA_LEFT,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeBullet",
        parent=styles["ResumeBody"],
        leftIndent=11,
        firstLineIndent=-7,
        bulletIndent=3,
        spaceBefore=0.4,
        spaceAfter=0.4,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeSmall",
        fontName="ResumeSerif",
        fontSize=8.7,
        leading=10.6,
        textColor=MUTED,
    )
)


def section(title):
    table = Table([[Paragraph(title, styles["ResumeSection"])]], colWidths=[178 * mm])
    table.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ("LINEBELOW", (0, 0), (-1, -1), 0.65, BLUE),
            ]
        )
    )
    return table


def entry_header(title, date):
    table = Table(
        [[Paragraph(title, styles["ResumeEntryTitle"]), Paragraph(date, styles["ResumeDate"])]],
        colWidths=[139 * mm, 39 * mm],
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return table


def bullet(text):
    return Paragraph(f"<bullet>&bull;</bullet>{text}", styles["ResumeBullet"])


def entry(title, date, role, bullets):
    story = [entry_header(title, date)]
    if role:
        story.append(Paragraph(role, styles["ResumeRoleItalic"]))
    story.extend(bullet(item) for item in bullets)
    story.append(Spacer(1, 2.2 * mm))
    return KeepTogether(story)


def skill_row(label, detail):
    table = Table(
        [[Paragraph(f"<b>{label}</b>", styles["ResumeBody"]), Paragraph(detail, styles["ResumeBody"])]],
        colWidths=[37 * mm, 141 * mm],
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0.4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0.4),
            ]
        )
    )
    return table


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.45)
    canvas.line(16 * mm, 12 * mm, 194 * mm, 12 * mm)
    canvas.setFont("ResumeSans", 7.4)
    canvas.setFillColor(MUTED)
    canvas.drawString(16 * mm, 8.5 * mm, "Xiao Chuyu | Robotics Engineering Portfolio")
    canvas.drawRightString(194 * mm, 8.5 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build_story():
    story = [
        Paragraph("Xiao Chuyu", styles["ResumeName"]),
        Paragraph(
            "Robotics Engineering / Embedded Control / Medical Devices / Student Founder",
            styles["ResumeRole"],
        ),
        Paragraph(
            'Chongqing, China &nbsp;&nbsp;|&nbsp;&nbsp; '
            '<link href="mailto:thosli666@gmail.com" color="#46546B">thosli666@gmail.com</link> '
            '&nbsp;&nbsp;|&nbsp;&nbsp; '
            '<link href="https://lithos666.github.io/" color="#0B5A97">lithos666.github.io</link> '
            '&nbsp;&nbsp;|&nbsp;&nbsp; '
            '<link href="https://github.com/lithos666" color="#0B5A97">github.com/lithos666</link>',
            styles["ResumeContact"],
        ),
        Paragraph(
            "Third-year Robotics Engineering student at Chongqing University and Project Lead of Goodent. "
            "Across 20+ project-based builds, I connect mechanical design, embedded control, robotics, "
            "product validation and market evidence to create testable physical systems.",
            styles["ResumeSummary"],
        ),
        section("Education"),
        Spacer(1, 1.2 * mm),
        entry_header(
            "Chongqing University (CQU) - B.Eng. in Robotics Engineering",
            "Sep 2023 - Jun 2027 (Expected)",
        ),
        Paragraph(
            "National School of Excellent Engineers | Mingyue Sci-Tech Innovation Class",
            styles["ResumeRoleItalic"],
        ),
        bullet("<b>Academic record:</b> GPA 3.68/4.0; Major Rank 9/58."),
        bullet(
            "<b>International study:</b> Selected through the university exchange programme for a funded "
            "Fall 2026 semester at the Singapore University of Technology and Design (SUTD)."
        ),
        bullet("<b>Languages:</b> CET-4 534; CET-6 436; native Mandarin Chinese."),
        Spacer(1, 1.8 * mm),
        section("Engineering Skills"),
        Spacer(1, 1.2 * mm),
        skill_row("Mechanical", "SolidWorks, Fusion 360, parametric CAD, DFM, 3D printing, assembly planning"),
        skill_row("Simulation", "COMSOL Multiphysics, ADAMS, PSIM, MATLAB"),
        skill_row("Embedded", "STM32, ESP32-S3, Arduino, PCB, C/C++, sensor integration, motor control"),
        skill_row("Robotics", "LeRobot, ACT, ArUco, MediaPipe, teleoperation, demonstration datasets"),
        skill_row("Product", "Prototype iteration, user research, competitive analysis, verification planning, pitching"),
        Spacer(1, 2 * mm),
        section("Selected Project Experience"),
        Spacer(1, 1.3 * mm),
        entry(
            "Goodent Intelligent Dental Power System",
            "2026 - Present",
            "Project Lead / Co-founder",
            [
                "Lead product definition, system architecture, motor control and team delivery for a clinically oriented intelligent dental power system.",
                "Advanced three prototype generations toward engineering validation; building the torque, speed, thermal and abnormal-load test chain.",
                "Secured RMB 500k in seed funding and began medical-device regulatory preparation.",
            ],
        ),
        entry(
            "LeRobot Dental Robotics",
            "2026",
            "System Integration / Vision Calibration / Dataset Analysis",
            [
                "Built a dental-manipulation workflow on a 6-DOF arm using ArUco pose alignment, leader-follower teleoperation, LeRobot and ACT.",
                "Reviewed dataset distributions, joint trajectories, smoothing behavior and task keyframes to improve demonstration quality.",
            ],
        ),
        entry(
            "DIY BLDC Motor - Coreless V1 to Inner-Rotor V2",
            "2026",
            "Motor Mechanical Design / Winding / Embedded Drive",
            [
                "Built and ran a 12-slot/16-pole coreless BLDC prototype with a star winding, ESP32-S3 and sensorless ESC.",
                "Carried winding, phase-order, magnet-layout and mechanical-support lessons into a compact inner-rotor V2 design.",
            ],
        ),
        entry(
            "Gamma-Type Stirling Engine",
            "2025",
            "Mechanical System Design / Simulation / Prototype Fabrication",
            [
                "Completed a 41-part parametric assembly and connected thermodynamic analysis, COMSOL multiphysics, ADAMS dynamics and physical prototyping.",
            ],
        ),
        PageBreak(),
        section("Work, Venture and Leadership Experience"),
        Spacer(1, 1.3 * mm),
        entry(
            "Zhixing Technology",
            "2024",
            "Co-founder / Product Design Intern",
            [
                "Contributed to parametric off-road vehicle modelling, part-library management, industrial design and competitor research with SolidWorks and Creo.",
                "Supported product and venture execution as a co-founder; the project secured seven-figure RMB angel financing.",
            ],
        ),
        entry(
            "Lanjingling Smart Planter - National Innovation Programme",
            "2025",
            "Project Lead",
            [
                "Led user needs, enclosure design, sensing, automatic irrigation, embedded integration and two prototype iterations.",
                "Completed project documentation and defense; received an Excellent national-project completion rating.",
            ],
        ),
        entry(
            "CQ-U Robocon Team and Course Teaching",
            "2025",
            "Robocon Member / Teaching Assistant",
            [
                "Contributed robot chassis and suspension design while practising system decomposition and cross-functional collaboration.",
                "Supported Ergonomics and Robotics Basics courses as a teaching assistant.",
            ],
        ),
        section("Additional Engineering Projects"),
        Spacer(1, 1.3 * mm),
        entry(
            "3D-Printed Pneumatic Vehicle",
            "2025",
            "Vehicle Mechanical Design / Transmission / DFM",
            [
                "Decomposed the chassis, engine, gearbox, differential, steering and suspension into printable, serviceable modules backed by a complete BOM.",
            ],
        ),
        entry(
            "ECG Signal Processing and Embedded Acquisition",
            "2025",
            "DSP / Embedded C / MATLAB",
            [
                "Developed filtering, QRS detection and heart-rate analysis workflows across MATLAB and embedded C, including GUI-based signal inspection.",
            ],
        ),
        entry(
            "Human Mesh Strain Analysis",
            "2026",
            "Python / Trimesh / Blender",
            [
                "Built a mesh-deformation workflow to compare body poses using area strain, shear and edge-length metrics with vertex-color visualization.",
            ],
        ),
        section("Selected Coursework and Engineering Methods"),
        Spacer(1, 1.3 * mm),
        skill_row(
            "Coursework",
            "Automatic Control, Microcircuit Design, Numerical Analysis, Engineering Design, Ergonomics, Robotics Basics",
        ),
        skill_row(
            "Motor Systems",
            "Back-EMF and commutation analysis, winding and pole review, layered STM32 motor-control debugging",
        ),
        skill_row(
            "Product Validation",
            "User context to verifiable requirements, prototype-to-EVT stage gates, medical-device risk-to-test planning",
        ),
        skill_row(
            "Market Practice",
            "User interviews, competitive positioning, venture evidence, pitch and fundraising preparation",
        ),
        Spacer(1, 2 * mm),
        section("Selected Recognition and Evidence"),
        Spacer(1, 1.3 * mm),
        bullet("<b>Goodent:</b> RMB 500k seed funding; three prototype generations; engineering validation in progress."),
        bullet("<b>Zhixing venture:</b> Project secured seven-figure RMB angel financing."),
        bullet("<b>National Innovation Programme:</b> Excellent completion rating as project lead."),
        bullet("<b>SUTD:</b> Funded Fall 2026 exchange placement selected independently through the university programme."),
        bullet("<b>Portfolio:</b> 20+ project-based builds spanning mechanics, simulation, embedded control, robotics and product development."),
        Spacer(1, 3 * mm),
        Paragraph(
            "Project evidence, prototype media and engineering notes are available at lithos666.github.io.",
            styles["ResumeSmall"],
        ),
    ]
    return story


def main():
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_PDF.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=13 * mm,
        bottomMargin=16 * mm,
        title="Xiao Chuyu - Robotics Engineering Resume",
        author="Xiao Chuyu",
        subject="Robotics Engineering, Embedded Control and Medical Devices",
    )
    doc.build(build_story(), onFirstPage=footer, onLaterPages=footer)
    copyfile(OUTPUT_PDF, PUBLIC_PDF)
    print(OUTPUT_PDF)
    print(PUBLIC_PDF)


if __name__ == "__main__":
    main()
