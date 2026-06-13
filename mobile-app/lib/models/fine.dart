class Fine {
  final String referenceNumber;
  final String violationName;
  final double amount;
  final String status;
  final String fineDate;

  Fine({
    required this.referenceNumber,
    required this.violationName,
    required this.amount,
    required this.status,
    required this.fineDate,
  });

  factory Fine.fromJson(Map<String, dynamic> json) {
    return Fine(
      referenceNumber: json["referenceNumber"],
      violationName: json["violationName"],
      amount: (json["amount"] as num).toDouble(),
      status: json["status"],
      fineDate: json["fineDate"],
    );
  }
}