import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/notifications_provider.dart';
import '../../models/notification.dart';
import '../applications/applications_screen.dart';
import '../offers/offers_screen.dart';
import '../profile/profile_screen.dart';

/// NOTIFICATIONS SCREEN - Display user notifications
class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.slate50,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Notifications',
          style: AppTypography.headlineMedium.copyWith(
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        actions: [
          Consumer<NotificationsProvider>(
            builder: (context, notifProvider, _) {
              if (notifProvider.hasUnread) {
                return TextButton(
                  onPressed: () => notifProvider.markAllAsRead(),
                  child: Text(
                    'Tout marquer comme lu',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.primaryBlue,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                );
              }
              return const SizedBox.shrink();
            },
          ),
          IconButton(
            icon: const Icon(Icons.delete_sweep_rounded, color: AppColors.errorRed),
            onPressed: () => _showClearDialog(context),
            tooltip: 'Tout supprimer',
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert_rounded, color: AppColors.textPrimary),
            onSelected: (value) {
              if (value == 'clear') {
                _showClearDialog(context);
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'clear',
                child: Row(
                  children: [
                    Icon(Icons.delete_outline, color: AppColors.errorRed, size: 20),
                    SizedBox(width: 12),
                    Text('Tout supprimer'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: Consumer<NotificationsProvider>(
        builder: (context, notifProvider, _) {
          final notifications = notifProvider.notifications;

          if (notifications.isEmpty) {
            return _buildEmptyState();
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: notifications.length,
            separatorBuilder: (context, index) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final notification = notifications[index];
              return _buildNotificationCard(context, notification, notifProvider);
            },
          );
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_none_rounded,
            size: 80,
            color: AppColors.slate300,
          ),
          const SizedBox(height: 16),
          Text(
            'Aucune notification',
            style: AppTypography.titleLarge.copyWith(
              color: AppColors.textMuted,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Vous n\'avez aucune notification pour le moment',
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textMuted,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard(
    BuildContext context,
    AppNotification notification,
    NotificationsProvider provider,
  ) {
    final isUnread = !notification.isRead;

    return Dismissible(
      key: Key(notification.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: AppColors.errorRed,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(
          Icons.delete_outline,
          color: Colors.white,
          size: 24,
        ),
      ),
      onDismissed: (direction) {
        provider.deleteNotification(notification.id);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Notification supprimée'),
            duration: Duration(seconds: 2),
          ),
        );
      },
      child: InkWell(
        onTap: () {
          if (isUnread) {
            provider.markAsRead(notification.id);
          }
          _handleNotificationTap(context, notification);
        },
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isUnread ? AppColors.primaryBlue.withOpacity(0.05) : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isUnread ? AppColors.primaryBlue.withOpacity(0.2) : AppColors.slate200,
              width: isUnread ? 2 : 1,
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: _getNotificationColor(notification.type).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  _getNotificationIcon(notification.type),
                  color: _getNotificationColor(notification.type),
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),

              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            notification.title,
                            style: AppTypography.bodyMedium.copyWith(
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                        if (isUnread)
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: AppColors.primaryBlue,
                              shape: BoxShape.circle,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notification.message,
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _formatDateTime(notification.createdAt),
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getNotificationIcon(String type) {
    switch (type) {
      case 'APPLICATION_STATUS':
        return Icons.description_rounded;
      case 'NEW_OFFER':
        return Icons.work_outline_rounded;
      case 'EVALUATION':
        return Icons.star_outline_rounded;
      case 'SYSTEM':
      default:
        return Icons.info_outline_rounded;
    }
  }

  Color _getNotificationColor(String type) {
    switch (type) {
      case 'APPLICATION_STATUS':
        return AppColors.accentAmber;
      case 'NEW_OFFER':
        return AppColors.primaryBlue;
      case 'EVALUATION':
        return AppColors.successGreen;
      case 'SYSTEM':
      default:
        return AppColors.slate400;
    }
  }

  String _formatDateTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'À l\'instant';
    } else if (difference.inHours < 1) {
      return 'Il y a ${difference.inMinutes} min';
    } else if (difference.inDays < 1) {
      return 'Il y a ${difference.inHours}h';
    } else if (difference.inDays < 7) {
      return 'Il y a ${difference.inDays}j';
    } else {
      return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
    }
  }

  void _handleNotificationTap(BuildContext context, AppNotification notification) {
    // Navigate based on action URL
    if (notification.actionUrl != null) {
      switch (notification.actionUrl) {
        case '/applications':
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const ApplicationsScreen()),
          );
          break;
        case '/offers':
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const OffersScreen()),
          );
          break;
        case '/profile':
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const ProfileScreen()),
          );
          break;
      }
    }
  }

  void _showClearDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Supprimer toutes les notifications'),
        content: const Text(
          'Êtes-vous sûr de vouloir supprimer toutes les notifications ?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              context.read<NotificationsProvider>().clearAll();
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Toutes les notifications ont été supprimées'),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.errorRed,
            ),
            child: const Text('Supprimer'),
          ),
        ],
      ),
    );
  }
}
