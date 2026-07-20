class Fine {
  final int id;
  final String referenceNumber;
  final String categoryName;
  final double amount;
  final String status;
  final int officerId;
  final int driverId;
  final String? fineDate;

  Fine({
    required this.id,
    required this.referenceNumber,
    required this.categoryName,
    required this.amount,
    required this.status,
    required this.officerId,
    required this.driverId,
    this.fineDate,
  });

  factory Fine.fromJson(Map<String, dynamic> json) {
    return Fine(
      id: json['id'] ?? 0,
      referenceNumber: json["referenceNumber"] ?? "",
      categoryName: json["categoryName"] ?? "",
      amount: (json["amount"] ?? 0).toDouble(),
      status: json["status"] ?? "NOT_PAID",
      officerId: json["officerId"] ?? 0,
      driverId: json["driverId"] ?? 0,
      fineDate: json["fineDate"]?.toString(),
    );
  }
}