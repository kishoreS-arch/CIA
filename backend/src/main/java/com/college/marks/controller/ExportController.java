package com.college.marks.controller;

import com.college.marks.entity.Mark;
import com.college.marks.repository.MarkRepository;
import com.college.marks.repository.StudentRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.util.List;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/report")
    public ResponseEntity<byte[]> exportReport() {
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            
            document.open();
            document.add(new Paragraph("College Marks Report"));
            document.add(new Paragraph("-------------------------------------------------"));
            
            List<Mark> marks = markRepository.findAll();
            int failCount = 0;
            
            for (Mark m : marks) {
                document.add(new Paragraph("Student: " + m.getStudent().getName() + " (" + m.getStudent().getRegNo() + ")"));
                document.add(new Paragraph("Subject: " + m.getSubject().getSubjectName()));
                document.add(new Paragraph("CT1: " + (m.getCt1Marks() != null ? m.getCt1Marks() : "N/A")));
                document.add(new Paragraph("CT2: " + (m.getCt2Marks() != null ? m.getCt2Marks() : "N/A")));
                document.add(new Paragraph(" "));
                
                if((m.getCt1Marks() != null && m.getCt1Marks() < 30) || (m.getCt2Marks() != null && m.getCt2Marks() < 30)) {
                    failCount++;
                }
            }
            
            document.add(new Paragraph("-------------------------------------------------"));
            document.add(new Paragraph("Total Failures across subjects: " + failCount));
            document.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "report.pdf");
            
            return ResponseEntity.ok().headers(headers).body(out.toByteArray());
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
