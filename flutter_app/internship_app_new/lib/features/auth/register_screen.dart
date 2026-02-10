import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/auth_provider.dart';
import 'login_screen.dart';
import '../home/home_screen.dart';

/// SCREEN 3: REGISTER - Student registration
/// Exact match to SuperDesign: sticky header with progress, compact labels, password strength
class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _schoolController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _acceptTerms = false;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  String _selectedLevel = '';

  double _getPasswordStrength() {
    final password = _passwordController.text;
    if (password.isEmpty) return 0;
    if (password.length < 4) return 0.25;
    if (password.length < 6) return 0.5;
    if (password.length < 8) return 0.75;
    return 1.0;
  }

  String _getPasswordStrengthText() {
    final strength = _getPasswordStrength();
    if (strength == 0) return '';
    if (strength <= 0.25) return 'Faible';
    if (strength <= 0.5) return 'Moyen';
    if (strength <= 0.75) return 'Bien';
    return 'Fort';
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _schoolController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // ==================== Sticky Header ====================
            _buildStickyHeader(),

            // ==================== Scrollable Form ====================
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.spacing32,
                  vertical: AppSpacing.spacing24,
                ),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // First Name + Last Name (Grid 2 cols)
                      Row(
                        children: [
                          Expanded(
                            child: _buildCompactTextField(
                              label: 'PRÉNOM',
                              controller: _firstNameController,
                              placeholder: 'Jean',
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildCompactTextField(
                              label: 'NOM',
                              controller: _lastNameController,
                              placeholder: 'Dupont',
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      // Email
                      _buildCompactTextField(
                        label: 'EMAIL ACADÉMIQUE',
                        controller: _emailController,
                        placeholder: 'jean.dupont@ecole.fr',
                        icon: Icons.email_outlined,
                        keyboardType: TextInputType.emailAddress,
                      ),

                      const SizedBox(height: 16),

                      // School
                      _buildCompactTextField(
                        label: 'ÉCOLE / UNIVERSITÉ',
                        controller: _schoolController,
                        placeholder: 'HEC, Sorbonne, EPITA...',
                        icon: Icons.school_outlined,
                      ),

                      const SizedBox(height: 16),

                      // Education Level (Dropdown)
                      _buildLevelDropdown(),

                      const SizedBox(height: 24),

                      // Password with Strength Indicator
                      _buildPasswordField(),

                      const SizedBox(height: 24),

                      // Terms & Conditions Checkbox
                      _buildTermsCheckbox(),

                      const SizedBox(height: 24),

                      // Register Button
                      Consumer<AuthProvider>(
                        builder: (context, authProvider, child) {
                          return ElevatedButton(
                            onPressed: authProvider.isLoading
                                ? null
                                : () async {
                                    if (!_acceptTerms) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(
                                          content: Text('Veuillez accepter les conditions'),
                                          backgroundColor: AppColors.errorRed,
                                        ),
                                      );
                                      return;
                                    }

                                    if (_formKey.currentState!.validate()) {
                                      final success = await authProvider.register(
                                        email: _emailController.text.trim(),
                                        password: _passwordController.text.trim(),
                                        firstName: _firstNameController.text.trim(),
                                        lastName: _lastNameController.text.trim(),
                                        school: _schoolController.text.trim(),
                                        level: _selectedLevel,
                                      );

                                      if (mounted) {
                                        if (success) {
                                          // Registration successful, navigate to login
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            const SnackBar(
                                              content: Text('Inscription réussie ! Connectez-vous maintenant.'),
                                              backgroundColor: AppColors.successGreen,
                                              duration: Duration(seconds: 3),
                                            ),
                                          );
                                          // Navigate to LoginScreen
                                          Navigator.of(context).pushReplacement(
                                            MaterialPageRoute(
                                              builder: (_) => const LoginScreen(),
                                            ),
                                          );
                                        } else {
                                          // Show error
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            SnackBar(
                                              content: Text(authProvider.error ?? 'Erreur d\'inscription'),
                                              backgroundColor: AppColors.errorRed,
                                            ),
                                          );
                                        }
                                      }
                                    }
                                  },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.accentAmber,
                              minimumSize: const Size(double.infinity, 48),
                              elevation: 8,
                            ),
                            child: authProvider.isLoading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  )
                                : Text(
                                    'S\'inscrire',
                                    style: AppTypography.button.copyWith(color: Colors.white),
                                  ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // ==================== Footer: Login Link ====================
            Container(
              padding: const EdgeInsets.all(AppSpacing.spacing24),
              decoration: const BoxDecoration(
                color: AppColors.slate50,
                border: Border(
                  top: BorderSide(color: AppColors.slate100, width: 1),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Déjà un compte ? ',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.of(context).pop();
                    },
                    child: Text(
                      'Se connecter',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.primaryBlue,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStickyHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(32, 32, 32, 16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(color: AppColors.slate100, width: 1),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Back Button + Progress Indicators
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Back Button
              IconButton(
                onPressed: () => Navigator.of(context).pop(),
                icon: const Icon(Icons.chevron_left, size: 28),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
              ),

              // Progress Indicators
              Row(
                children: [
                  Container(
                    width: 24,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppColors.primaryBlue,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Container(
                    width: 8,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppColors.borderColor,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Title
          Text(
            'Créer un compte',
            style: AppTypography.headlineMedium.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),

          const SizedBox(height: 4),

          // Subtitle
          Text(
            'Rejoignez StageConnect en tant qu\'étudiant',
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCompactTextField({
    required String label,
    required TextEditingController controller,
    required String placeholder,
    IconData? icon,
    TextInputType? keyboardType,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Compact Label (uppercase, small, gray)
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: AppColors.textMuted,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 4),

        // Text Field (compact)
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          style: AppTypography.bodySmall,
          decoration: InputDecoration(
            hintText: placeholder,
            hintStyle: AppTypography.bodySmall.copyWith(
              color: AppColors.textMuted,
            ),
            prefixIcon: icon != null
                ? Icon(icon, size: 16, color: AppColors.textMuted)
                : null,
            contentPadding: EdgeInsets.symmetric(
              horizontal: icon != null ? 12 : 16,
              vertical: 10,
            ),
            filled: true,
            fillColor: AppColors.slate50,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.borderColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.borderColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.primaryBlue, width: 2),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLevelDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'NIVEAU D\'ÉTUDES',
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: AppColors.textMuted,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 4),

        // Dropdown
        DropdownButtonFormField<String>(
          value: _selectedLevel.isEmpty ? null : _selectedLevel,
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.book_outlined, size: 16, color: AppColors.textMuted),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            filled: true,
            fillColor: AppColors.slate50,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.borderColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.borderColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.primaryBlue, width: 2),
            ),
          ),
          hint: Text(
            'Sélectionner un niveau',
            style: AppTypography.bodySmall.copyWith(color: AppColors.textMuted),
          ),
          items: const [
            DropdownMenuItem(value: 'L1L2', child: Text('Licence 1/2', style: TextStyle(fontSize: 13))),
            DropdownMenuItem(value: 'L3', child: Text('Licence 3 / Bachelor', style: TextStyle(fontSize: 13))),
            DropdownMenuItem(value: 'M1', child: Text('Master 1 / Bac+4', style: TextStyle(fontSize: 13))),
            DropdownMenuItem(value: 'M2', child: Text('Master 2 / Bac+5', style: TextStyle(fontSize: 13))),
            DropdownMenuItem(value: 'DOC', child: Text('Doctorat', style: TextStyle(fontSize: 13))),
          ],
          onChanged: (value) {
            setState(() {
              _selectedLevel = value ?? '';
            });
          },
        ),
      ],
    );
  }

  Widget _buildPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'MOT DE PASSE',
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: AppColors.textMuted,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 4),

        // Password Field
        TextFormField(
          controller: _passwordController,
          obscureText: _obscurePassword,
          onChanged: (_) => setState(() {}),
          style: AppTypography.bodySmall,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Mot de passe requis';
            }
            if (value.length < 6) {
              return 'Minimum 6 caractères';
            }
            return null;
          },
          decoration: InputDecoration(
            hintText: '••••••••',
            hintStyle: AppTypography.bodySmall.copyWith(color: AppColors.textMuted),
            suffixIcon: IconButton(
              icon: Icon(
                _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                size: 16,
                color: AppColors.textMuted,
              ),
              onPressed: () {
                setState(() {
                  _obscurePassword = !_obscurePassword;
                });
              },
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            filled: true,
            fillColor: AppColors.slate50,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.borderColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.borderColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.primaryBlue, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.errorRed),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.errorRed, width: 2),
            ),
          ),
        ),

        const SizedBox(height: 6),

        // Password Strength Bars
        Row(
          children: List.generate(4, (index) {
            final strength = _getPasswordStrength();
            final isActive = (index + 1) <= (strength * 4);
            return Expanded(
              child: Container(
                height: 4,
                margin: EdgeInsets.only(right: index < 3 ? 4 : 0),
                decoration: BoxDecoration(
                  color: isActive ? AppColors.accentAmber : AppColors.borderColor,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            );
          }),
        ),

        const SizedBox(height: 4),

        // Strength Text
        if (_passwordController.text.isNotEmpty)
          Text(
            'Sécurité : ${_getPasswordStrengthText()}',
            style: const TextStyle(
              fontSize: 9,
              color: AppColors.textSecondary,
            ),
          ),

        const SizedBox(height: 16),

        // CONFIRM PASSWORD FIELD
        const Text(
          'CONFIRMER MOT DE PASSE',
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: AppColors.textMuted,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 4),

        TextFormField(
          controller: _confirmPasswordController,
          obscureText: _obscureConfirmPassword,
          style: AppTypography.bodySmall,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Confirmation requise';
            }
            if (value != _passwordController.text) {
              return 'Les mots de passe ne correspondent pas';
            }
            return null;
          },
          decoration: InputDecoration(
            hintText: '••••••••',
            hintStyle: AppTypography.bodySmall.copyWith(color: AppColors.textMuted),
            suffixIcon: IconButton(
              icon: Icon(
                _obscureConfirmPassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                size: 16,
                color: AppColors.textMuted,
              ),
              onPressed: () {
                setState(() {
                  _obscureConfirmPassword = !_obscureConfirmPassword;
                });
              },
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            filled: true,
            fillColor: AppColors.slate50,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.borderColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.borderColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.primaryBlue, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.errorRed),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              borderSide: const BorderSide(color: AppColors.errorRed, width: 2),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTermsCheckbox() {
    return GestureDetector(
      onTap: () {
        setState(() {
          _acceptTerms = !_acceptTerms;
        });
      },
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 16,
            height: 16,
            child: Checkbox(
              value: _acceptTerms,
              onChanged: (value) {
                setState(() {
                  _acceptTerms = value ?? false;
                });
              },
              activeColor: AppColors.primaryBlue,
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              visualDensity: VisualDensity.compact,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: const TextStyle(
                  fontSize: 10,
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
                children: [
                  const TextSpan(text: 'J\'accepte les '),
                  TextSpan(
                    text: 'conditions d\'utilisation',
                    style: const TextStyle(
                      color: AppColors.primaryBlue,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const TextSpan(text: ' et la politique de confidentialité.'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
