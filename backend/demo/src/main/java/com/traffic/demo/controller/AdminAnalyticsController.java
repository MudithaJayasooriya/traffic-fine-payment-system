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
@CrossOrigin(origins = "*") // Allows your React app on port 5173 to fetch data safely
@PreAuthorize("hasRole('ADMIN')") // Secures data so only logged-in Admins can access it
public class AdminAnalyticsController {

    private final FineRepository fineRepository;
    private final PaymentRepository paymentRepository;
    private final FineCategoryRepository fineCategoryRepository;
    private final com.traffic.demo.repository.UserRepository userRepository;

    private static final List<String> ALL_DISTRICTS = List.of(
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha",
        "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala",
        "Mannar", "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya",
        "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
    );

    // 1. FOR: AdminDashboard.jsx (/api/dashboard/stats)
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

    // 2. FOR: PendingFines.jsx (/api/fines/pending)
    @GetMapping("/fines/pending")
    public Map<String, Object> getPendingFines(
            @RequestParam(required = false) String ref,
            @RequestParam(required = false) String nic,
            @RequestParam(required = false) String district,
            @RequestParam(required = false, defaultValue = "NOT_PAID") String status) {

        List<Fine> pendingFines = fineRepository.findAll().stream()
                .filter(f -> status == null || status.trim().isEmpty() || "ALL".equalsIgnoreCase(status) || f.getStatus().equalsIgnoreCase(status))
                .filter(f -> ref == null || ref.trim().isEmpty() || f.getReferenceNumber().toLowerCase().contains(ref.toLowerCase()))
                .toList();

        // Map database entities to structures your frontend table expects
        List<Map<String, Object>> fineListMapped = pendingFines.stream().map(f -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", f.getId());
                    map.put("referenceNumber", f.getReferenceNumber());

                    // DYNAMICALLY FETCH THE DRIVER NIC FROM USER TABLE
                    String driverNicNumber = "N/A";
                    try {
                        Optional<com.traffic.demo.entity.User> driverOpt = userRepository.findById(f.getDriverId());
                        if (driverOpt.isPresent()) {
                            driverNicNumber = driverOpt.get().getNicNumber(); // Fetches the driver's real NIC
                        }
                    } catch (Exception e) {
                        // Fallback if user service fails
                    }

                    map.put("driverNic", driverNicNumber); // Maps to fine.driverNic in React
                    
                    String districtName = f.getDistrict() != null && !f.getDistrict().isEmpty() ? f.getDistrict() : "Colombo";
                    map.put("district", districtName); // Maps to fine.district in React
                    
                    map.put("category", f.getCategory() != null ? f.getCategory().getCategoryName() : "General Traffic Fine");
                    map.put("amount", f.getAmount());
                    map.put("issueDate", f.getFineDate().toString()); // Maps to fine.issueDate in React
                    map.put("status", f.getStatus());
                    return map;
                })
                // Apply frontend filters in Java code if specified
                .filter(map -> nic == null || nic.trim().isEmpty() || map.get("driverNic").toString().toLowerCase().contains(nic.toLowerCase()))
                .filter(map -> district == null || "All Districts".equals(district) || district.trim().isEmpty() || map.get("district").toString().equalsIgnoreCase(district))
                .toList();

        double totalAmount = fineListMapped.stream().mapToDouble(m -> (Double) m.get("amount")).sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCount", fineListMapped.size());
        summary.put("totalAmount", totalAmount);
        summary.put("overdueCount", 0);

        Map<String, Object> response = new HashMap<>();
        response.put("fines", fineListMapped); // Key must be "fines"
        response.put("summary", summary);     // Key must be "summary"
        return response;
    }

    // 3. FOR: RevenueReports.jsx (/api/reports/revenue)
    @GetMapping("/reports/revenue")
    public Map<String, Object> getRevenueReports(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String district) {

        List<Payment> payments = paymentRepository.findAll().stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .filter(p -> {
                    if (startDate == null || startDate.trim().isEmpty()) return true;
                    try {
                        LocalDate start = LocalDate.parse(startDate);
                        return !p.getPaymentDate().toLocalDate().isBefore(start);
                    } catch (Exception e) {
                        return true;
                    }
                })
                .filter(p -> {
                    if (endDate == null || endDate.trim().isEmpty()) return true;
                    try {
                        LocalDate end = LocalDate.parse(endDate);
                        return !p.getPaymentDate().toLocalDate().isAfter(end);
                    } catch (Exception e) {
                        return true;
                    }
                })
                .toList();

        double totalRevenue = payments.stream().mapToDouble(Payment::getAmount).sum();

        LocalDate today = LocalDate.now();
        double collectedToday = payments.stream()
                .filter(p -> p.getPaymentDate().toLocalDate().isEqual(today))
                .mapToDouble(Payment::getAmount)
                .sum();

        List<Map<String, Object>> transactions = payments.stream().map(p -> {
            Map<String, Object> t = new HashMap<>();
            t.put("id", p.getPayment_id());
            
            String districtName = "Colombo";
            if (p.getFineId() != null) {
                Optional<Fine> fineOpt = fineRepository.findById(p.getFineId());
                if (fineOpt.isPresent() && fineOpt.get().getDistrict() != null && !fineOpt.get().getDistrict().isEmpty()) {
                    districtName = fineOpt.get().getDistrict();
                }
            }
            t.put("district", districtName);
            
            String categoryName = "Traffic Infraction";
            if (p.getFineId() != null) {
                Optional<Fine> fineOpt = fineRepository.findById(p.getFineId());
                if (fineOpt.isPresent() && fineOpt.get().getCategory() != null) {
                    categoryName = fineOpt.get().getCategory().getCategoryName();
                }
            }
            t.put("category", categoryName);
            
            t.put("amount", p.getAmount());
            t.put("date", p.getPaymentDate().toLocalDate().toString());
            t.put("status", "SUCCESS");
            return t;
        })
        .filter(t -> district == null || "All Districts".equals(district) || district.trim().isEmpty() || t.get("district").toString().equalsIgnoreCase(district))
        .toList();

        // Calculate dynamic breakdowns
        Map<String, Double> districtCollectionMap = new HashMap<>();
        Map<String, Double> categoryCollectionMap = new HashMap<>();

        // Initialize defaults
        for (String dist : ALL_DISTRICTS) {
            districtCollectionMap.put(dist, 0.0);
        }

        for (Map<String, Object> t : transactions) {
            String dist = (String) t.get("district");
            String cat = (String) t.get("category");
            Double amt = (Double) t.get("amount");

            districtCollectionMap.put(dist, districtCollectionMap.getOrDefault(dist, 0.0) + amt);
            categoryCollectionMap.put(cat, categoryCollectionMap.getOrDefault(cat, 0.0) + amt);
        }

        List<Map<String, Object>> districtBreakdown = new ArrayList<>();
        districtCollectionMap.forEach((dist, collection) -> {
            districtBreakdown.add(Map.of("district", dist, "collection", collection));
        });

        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
        categoryCollectionMap.forEach((cat, collection) -> {
            categoryBreakdown.add(Map.of("category", cat, "collection", collection));
        });

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

    // 4. FOR: Statistics.jsx (/api/analytics/overview)
    @GetMapping("/analytics/overview")
    public Map<String, Object> getAnalyticsOverview() {
        List<Fine> allFines = fineRepository.findAll();
        List<Payment> successPayments = paymentRepository.findAll().stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .toList();

        double totalRevenue = successPayments.stream().mapToDouble(Payment::getAmount).sum();
        long paidCount = allFines.stream().filter(f -> "PAID".equals(f.getStatus())).count();
        long pendingCount = allFines.stream().filter(f -> "NOT_PAID".equals(f.getStatus())).count();

        // 1. District chart map format (Group by dynamic district based on fine id)
        Map<String, Double> districtRevenueMap = new HashMap<>();
        for (String dist : ALL_DISTRICTS) {
            districtRevenueMap.put(dist, 0.0);
        }

        for (Payment p : successPayments) {
            String dist = "Colombo";
            if (p.getFineId() != null) {
                Optional<Fine> fineOpt = fineRepository.findById(p.getFineId());
                if (fineOpt.isPresent() && fineOpt.get().getDistrict() != null && !fineOpt.get().getDistrict().isEmpty()) {
                    dist = fineOpt.get().getDistrict();
                }
            }
            districtRevenueMap.put(dist, districtRevenueMap.getOrDefault(dist, 0.0) + p.getAmount());
        }

        List<Map<String, Object>> districtData = new ArrayList<>();
        districtRevenueMap.forEach((dist, rev) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("district", dist);
            map.put("revenue", rev);
            districtData.add(map);
        });

        // 2. Category chart map format (Group by fine category and count)
        Map<String, Long> categoryCountMap = allFines.stream()
                .filter(f -> f.getCategory() != null)
                .collect(Collectors.groupingBy(
                        f -> f.getCategory().getCategoryName(),
                        Collectors.counting()
                ));

        List<Map<String, Object>> categoryData = new ArrayList<>();
        categoryCountMap.forEach((name, count) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", name);
            map.put("value", count);
            categoryData.add(map);
        });

        if (categoryData.isEmpty()) {
            categoryData.add(Map.of("name", "No Violations Recorded", "value", 0));
        }

        Map<String, Object> summary = new HashMap<>();
        // Fix double 'Rs.' prefix in UI by not prepending "Rs. " from the backend
        summary.put("totalRevenue", String.format("%.2f", totalRevenue));
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