import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/fine.dart';
import '../services/api_service.dart';

class FineService {

  final String baseUrl = "http://10.0.2.2:8080/api";

  Future<Fine?> createFine(
      String categoryCode,
      int officerId,
      int driverId,
      ) async {

    final token = await ApiService.getToken();

    final response = await http.post(
      Uri.parse("$baseUrl/fines"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "categoryCode": categoryCode,
        "officerId": officerId,
        "driverId": driverId,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
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

  Future<List<Fine>> getDriverFines(int driverId) async {

    final response = await http.get(
      Uri.parse("$baseUrl/fines/driver/$driverId"),
    );

    if (response.statusCode == 200) {

      List<dynamic> data = jsonDecode(response.body);

      return data
          .map((fine) => Fine.fromJson(fine))
          .toList();
    }

    return [];
  }

  Future<List<dynamic>> getAllCategories() async {

    final response = await http.get(
      Uri.parse("$baseUrl/categories"),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return [];
  }

  // SEARCH CATEGORIES
  // Used when typing in search box
  Future<List<dynamic>> searchCategories(
      String keyword) async {

    final String url =
        "$baseUrl/categories/search?keyword=$keyword";

    final response = await http.get(
      Uri.parse(url),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return [];
  }
  Future<List<dynamic>> getAllDrivers() async {
    final response = await http.get(
        Uri.parse("$baseUrl/users/drivers"),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return [];
  }

  Future<List<dynamic>> getAllOfficers() async {
    final response = await http.get(
      Uri.parse("$baseUrl/users/officers"),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return [];
  }

// GET USER BY ID (OFFICER)
  Future<Map<String, dynamic>?> getUserById(int id) async {
    final response = await http.get(
      Uri.parse("$baseUrl/users/$id"),
      headers: {"Content-Type": "application/json"},
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return null;
  }

  Future<List<dynamic>> searchUsers(String keyword) async {
    final response = await http.get(
      Uri.parse("$baseUrl/users/search?keyword=$keyword"),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return [];
  }
}