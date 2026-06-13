class Fine {
  final int id;
  final String referenceNumber;
  final String categoryCode;
  final String violationName;
  final double amount;
  final String status;
  final String fineDate;
  final int officerId;
  final int driverId;

  Fine({
    required this.id,
    required this.referenceNumber,
    required this.categoryCode,
    required this.violationName,
    required this.amount,
    required this.status,
    required this.fineDate,
    required this.officerId,
    required this.driverId,
  });

  factory Fine.fromJson(Map<String, dynamic> json) {
    return Fine(
      id: json["id"] ?? 0,
      referenceNumber: json["referenceNumber"] ?? '',
      categoryCode: json["categoryCode"] ?? '',
      violationName: json["categoryName"] ?? json["violationName"] ?? 'General Violation',
      amount: (json["amount"] as num).toDouble(),
      status: json["status"] ?? 'NOT_PAID',
      fineDate: json["fineDate"] ?? '',
      officerId: json["officerId"] ?? 0,
      driverId: json["driverId"] ?? 0,
    );
  }
}