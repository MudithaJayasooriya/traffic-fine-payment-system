import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import '../core/constants.dart';

class ApiService {
  static const _tokenKey = 'jwt_token';
  static const _roleKey = 'user_role';
  static const _nameKey = 'user_name';

  // ─── Token Storage ───────────────────────────────────────────────────────

  static Future<void> saveSession(String token, String role, String name) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setString(_roleKey, role);
    await prefs.setString(_nameKey, name);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<String?> getRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_roleKey);
  }

  static Future<String?> getName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_nameKey);
  }

  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    if (token == null) return false;
    // Check token not expired
    return !JwtDecoder.isExpired(token);
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_roleKey);
    await prefs.remove(_nameKey);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /// Safely extracts an error message whether the backend returned
  /// JSON (e.g. {"message": "..."}) or plain text (e.g. "Username taken").
  static String _extractErrorMessage(http.Response response) {
    try {
      final body = jsonDecode(response.body);
      if (body is Map && body['message'] != null) {
        return body['message'].toString();
      }
      return response.body;
    } catch (_) {
      // Not valid JSON — it's plain text, use it directly.
      return response.body;
    }
  }

  /// Extracts role and username from inside the JWT payload, since the
  /// backend's login/register response only returns {"token": "..."}.
  static Map<String, String> _extractRoleAndNameFromToken(
      String token, String fallbackUsername) {
    try {
      final decodedToken = JwtDecoder.decode(token);
      final roles = decodedToken['roles'] as List<dynamic>?;
      final rawRole =
      (roles != null && roles.isNotEmpty) ? roles[0].toString() : '';
      final role = rawRole.replaceFirst('ROLE_', ''); // "ROLE_DRIVER" -> "DRIVER"
      final username = decodedToken['sub']?.toString() ?? fallbackUsername;
      return {'role': role, 'username': username};
    } catch (_) {
      // If decoding fails for any reason, fall back to empty role.
      return {'role': '', 'username': fallbackUsername};
    }
  }

  // ─── API Calls ────────────────────────────────────────────────────────────

  static Future<Map<String, dynamic>> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}${AppConstants.loginEndpoint}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      final token = body['token'] ?? '';

      final extracted = _extractRoleAndNameFromToken(token, username);
      final role = extracted['role']!;
      final resolvedUsername = extracted['username']!;

      await saveSession(token, role, resolvedUsername);
      return {'success': true, 'role': role};
    } else {
      return {
        'success': false,
        'message': _extractErrorMessage(response),
      };
    }
  }

  static Future<Map<String, dynamic>> register({
    required String username,
    required String email,
    required String password,
    required String phoneNumber,
    required String nicNumber,
  }) async {
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}${AppConstants.registerEndpoint}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
        'phoneNumber': phoneNumber,
        'nicNumber': nicNumber,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final body = jsonDecode(response.body);
      final token = body['token'] ?? '';

      final extracted = _extractRoleAndNameFromToken(token, username);
      final role = extracted['role']!;
      final resolvedUsername = extracted['username']!;

      await saveSession(token, role, resolvedUsername);
      return {'success': true, 'role': role};
    } else {
      return {
        'success': false,
        'message': _extractErrorMessage(response),
      };
    }
  }
}