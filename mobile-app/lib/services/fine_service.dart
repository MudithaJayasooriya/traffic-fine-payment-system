import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/fine.dart';

class FineService {

  final String baseUrl = "http://10.0.2.2:8080/api";

  Future<Fine?> createFine(
      String categoryCode,
      int officerId,
      int driverId) async {

    final response = await http.post(
      Uri.parse("$baseUrl/fines"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "categoryCode": categoryCode,
        "officerId": officerId,
        "driverId": driverId
      }),
    );

    if (response.statusCode == 200) {
      return Fine.fromJson(jsonDecode(response.body));
    }

    return null;
  }

  Future<Fine?> searchFine(String referenceNumber) async {

    final response = await http.get(
      Uri.parse("$baseUrl/fines/$referenceNumber"),
    );

    if (response.statusCode == 200) {
      return Fine.fromJson(jsonDecode(response.body));
    }

    return null;
  }
}