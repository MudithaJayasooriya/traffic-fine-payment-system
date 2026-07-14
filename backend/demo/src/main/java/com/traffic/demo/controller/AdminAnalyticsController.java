package com.traffic.demo.controller;

import com.traffic.demo.entity.Fine;
import com.traffic.demo.entity.FineCategory;
import com.traffic.demo.entity.Payment;
import com.traffic.demo.repository.FineCategoryRepository;
import com.traffic.demo.repository.FineRepository;
import com.traffic.demo.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final FineRepository fineRepository;
    private final PaymentRepository paymentRepository;
    private final FineCategoryRepository fineCategoryRepository;
    private final com.traffic.demo.repository.UserRepository userRepository;

    // AdminDashboard.jsx
    @GetMapping("/dashboard/stats")
    public Map<String, Object> getDashboardStats() {
        List<Fine> allFines = fineRepository.findAll();
        List<Payment> successPayments = paymentRepository.findAll().stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .toList();

        double totalRevenue = successPayments.stream().mapToDouble(Payment::getAmount).sum();
        long paidCount = allFines.stream().filter(f -> "PAID".equals(f.getStatus())).count();
        long pendingCount = allFines.stream().filter(f -> "NOT_PAID".equals(f.getStatus())).count();
        long totalCategories = fineCategoryRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("paidFinesCount", paidCount);
        stats.put("pendingFinesCount", pendingCount);
        stats.put("totalCategories", totalCategories);
        return stats;
    }

    // PendingFines.jsx (/api/fines/pending)
    @GetMapping("/fines/pending")
    public Map<String, Object> getPendingFines(
            @RequestParam(required = false) String ref,
            @RequestParam(required = false) String nic,
            @RequestParam(required = false) String district) {

        List<Fine> pendingFines = fineRepository.findAll().stream()
                .filter(f -> "NOT_PAID".equals(f.getStatus()))
                .filter(f -> ref == null || ref.trim().isEmpty() || f.getReferenceNumber().toLowerCase().contains(ref.toLowerCase()))
                .toList();

        List<Map<String, Object>> fineListMapped = pendingFines.stream().map(f -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", f.getId());
                    map.put("referenceNumber", f.getReferenceNumber());

                    String driverNicNumber = "N/A";
                    try {
                        Optional<com.traffic.demo.entity.User> driverOpt = userRepository.findById(f.getDriverId());
                        if (driverOpt.isPresent()) {
                            driverNicNumber = driverOpt.get().getNicNumber(); 
                        }
                    } catch (Exception e) {

                    }

                    map.put("driverNic", driverNicNumber);
                    map.put("district", "Colombo");
                    map.put("category", f.getCategory() != null ? f.getCategory().getCategoryName() : "General Traffic Fine");
                    map.put("amount", f.getAmount());
                    map.put("issueDate", f.getFineDate().toString());
                    map.put("status", f.getStatus());
                    return map;
                })
                .filter(map -> nic == null || nic.trim().isEmpty() || map.get("driverNic").toString().toLowerCase().contains(nic.toLowerCase()))
                .toList();

        double totalAmount = fineListMapped.stream().mapToDouble(m -> (Double) m.get("amount")).sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCount", fineListMapped.size());
        summary.put("totalAmount", totalAmount);
        summary.put("overdueCount", 0);

        Map<String, Object> response = new HashMap<>();
        response.put("fines", fineListMapped);
        response.put("summary", summary);
        return response;
    }

    @GetMapping("/reports/revenue")
    public Map<String, Object> getRevenueReports(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String district) {

        List<Payment> payments = paymentRepository.findAll().stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .toList();

        double totalRevenue = payments.stream().mapToDouble(Payment::getAmount).sum();

        LocalDate today = LocalDate.now();
        double collectedToday = payments.stream()
                .filter(p -> p.getPaymentDate().toLocalDate().isEqual(today))
                .mapToDouble(Payment::getAmount)
                .sum();

        List<Map<String, Object>> districtBreakdown = List.of(
                Map.of("district", "Colombo", "collection", totalRevenue)
        );

        List<Map<String, Object>> categoryBreakdown = List.of(
                Map.of("category", "Speeding Fine", "collection", totalRevenue)
        );

        List<Map<String, Object>> transactions = payments.stream().map(p -> {
            Map<String, Object> t = new HashMap<>();
            t.put("id", p.getPayment_id());
            t.put("district", "Colombo");
            t.put("category", "Traffic Infraction");
            t.put("amount", p.getAmount());
            t.put("date", p.getPaymentDate().toLocalDate().toString());
            t.put("status", "SUCCESS");
            return t;
        }).toList();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", totalRevenue);
        summary.put("paidFines", payments.size());
        summary.put("collectedToday", collectedToday);

        Map<String, Object> response = new HashMap<>();
        response.put("transactions", transactions);
        response.put("districtBreakdown", districtBreakdown);
        response.put("categoryBreakdown", categoryBreakdown);
        response.put("summary", summary);
        return response;
    }

    //  Statistics.jsx (/api/analytics/overview)
    @GetMapping("/analytics/overview")
    public Map<String, Object> getAnalyticsOverview() {
        List<Fine> allFines = fineRepository.findAll();
        List<Payment> successPayments = paymentRepository.findAll().stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .toList();

        double totalRevenue = successPayments.stream().mapToDouble(Payment::getAmount).sum();
        long paidCount = allFines.stream().filter(f -> "PAID".equals(f.getStatus())).count();
        long pendingCount = allFines.stream().filter(f -> "NOT_PAID".equals(f.getStatus())).count();

        List<Map<String, Object>> districtData = List.of(
                Map.of("district", "Colombo", "revenue", totalRevenue)
        );

        // Category chart map format
        List<Map<String, Object>> categoryData = List.of(
                Map.of("name", "Speed Limit", "value", totalRevenue > 0 ? totalRevenue : 1000.0)
        );

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", "Rs. " + String.format("%.2f", totalRevenue));
        summary.put("totalFines", allFines.size());
        summary.put("paidFines", paidCount);
        summary.put("pendingFines", pendingCount);

        Map<String, Object> response = new HashMap<>();
        response.put("districtData", districtData);
        response.put("categoryData", categoryData);
        response.put("summary", summary);
        return response;
    }
}