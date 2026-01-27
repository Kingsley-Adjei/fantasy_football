import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  Image,
} from "react-native";

// Mock user data
const MOCK_USER = {
  name: "Emmanuel Kwashe",
  email: "emmanuel.kwashe@example.com",
  teamName: "THE MIGHTY EAGLES",
  region: "🇬🇭 Ghana",
  avatar: null, // null = use placeholder
  joinedDate: "August 2024",
  totalPoints: 1847,
  overallRank: 1234567,
  bestRank: 892341,
  leagues: 5,
  transfers: 12,
};

// Mock trophies
const TROPHIES = [
  { id: 1, icon: "🏆", name: "GW Winner", description: "Won Gameweek 15" },
  { id: 2, icon: "🥇", name: "Top 100", description: "Reached top 100 rank" },
  { id: 3, icon: "⚡", name: "Fast Starter", description: "Top scorer in GW1" },
  {
    id: 4,
    icon: "🎯",
    name: "Captain Perfect",
    description: "Captain scored 15+ pts",
  },
];

// Mock season history
const SEASON_HISTORY = [
  { season: "2024/25", rank: 1234567, points: 847 },
  { season: "2023/24", rank: 892341, points: 2143 },
  { season: "2022/23", rank: 1456789, points: 1987 },
];

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [transferAlerts, setTransferAlerts] = useState(true);
  const [goalAlerts, setGoalAlerts] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => Alert.alert("Success", "Logged out successfully"),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => Alert.alert("Account deleted"),
        },
      ]
    );
  };

  // Section Component
  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  // Menu Item Component
  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    color = "#37003C",
    showArrow = true,
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: color + "20" }]}>
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && <Text style={styles.menuArrow}>›</Text>}
    </TouchableOpacity>
  );

  // Preference Item Component
  const PreferenceItem = ({ icon, title, subtitle, value, onValueChange }) => (
    <View style={styles.preferenceItem}>
      <View style={styles.preferenceLeft}>
        <View style={styles.preferenceIcon}>
          <Text style={styles.preferenceIconText}>{icon}</Text>
        </View>
        <View style={styles.preferenceContent}>
          <Text style={styles.preferenceTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.preferenceSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E0E0E0", true: "#00FF85" }}
        thumbColor={value ? "#FFFFFF" : "#F5F5F5"}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Identity Card */}
        <View style={styles.identityCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {MOCK_USER.avatar ? (
              <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {MOCK_USER.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Text style={styles.editAvatarText}>📷</Text>
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <Text style={styles.userName}>{MOCK_USER.name}</Text>
          <Text style={styles.userEmail}>{MOCK_USER.email}</Text>

          <View style={styles.teamBadge}>
            <Text style={styles.teamName}>{MOCK_USER.teamName}</Text>
          </View>

          <View style={styles.regionBadge}>
            <Text style={styles.regionText}>{MOCK_USER.region}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {MOCK_USER.totalPoints.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {MOCK_USER.overallRank.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Overall Rank</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{MOCK_USER.leagues}</Text>
              <Text style={styles.statLabel}>Leagues</Text>
            </View>
          </View>
        </View>

        {/* Trophy Cabinet */}
        <Section title="🏆 Trophy Cabinet">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trophiesContainer}
          >
            {TROPHIES.map((trophy) => (
              <TouchableOpacity key={trophy.id} style={styles.trophyCard}>
                <Text style={styles.trophyIcon}>{trophy.icon}</Text>
                <Text style={styles.trophyName}>{trophy.name}</Text>
                <Text style={styles.trophyDescription}>
                  {trophy.description}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.trophyCardLocked}>
              <Text style={styles.trophyIconLocked}>🔒</Text>
              <Text style={styles.trophyNameLocked}>More to unlock</Text>
            </TouchableOpacity>
          </ScrollView>
        </Section>

        {/* Season History */}
        <Section title="📊 Season History">
          <View style={styles.seasonHistoryContainer}>
            {SEASON_HISTORY.map((season, index) => (
              <View key={index} style={styles.seasonRow}>
                <Text style={styles.seasonName}>{season.season}</Text>
                <View style={styles.seasonStats}>
                  <Text style={styles.seasonRank}>
                    #{season.rank.toLocaleString()}
                  </Text>
                  <Text style={styles.seasonPoints}>{season.points} pts</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        {/* Preferences */}
        <Section title="⚙️ Preferences">
          <View style={styles.preferencesContainer}>
            <PreferenceItem
              icon="🌙"
              title="Dark Mode"
              subtitle="Change app theme"
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <PreferenceItem
              icon="🔔"
              title="Push Notifications"
              subtitle="Get important updates"
              value={notifications}
              onValueChange={setNotifications}
            />
            <PreferenceItem
              icon="⏰"
              title="Transfer Deadline Alerts"
              subtitle="Reminders before deadline"
              value={transferAlerts}
              onValueChange={setTransferAlerts}
            />
            <PreferenceItem
              icon="⚽"
              title="Goal Alerts"
              subtitle="Live goal notifications"
              value={goalAlerts}
              onValueChange={setGoalAlerts}
            />
          </View>
        </Section>

        {/* Account Settings */}
        <Section title="👤 Account">
          <View style={styles.menuContainer}>
            <MenuItem
              icon="✉️"
              title="Change Email"
              subtitle={MOCK_USER.email}
              onPress={() => Alert.alert("Change Email", "Email change flow")}
            />
            <MenuItem
              icon="🔐"
              title="Change Password"
              subtitle="Last changed 3 months ago"
              onPress={() =>
                Alert.alert("Change Password", "Password change flow")
              }
            />
            <MenuItem
              icon="👥"
              title="Linked Accounts"
              subtitle="Connect social accounts"
              onPress={() =>
                Alert.alert("Linked Accounts", "Social linking flow")
              }
            />
          </View>
        </Section>

        {/* Support & Legal */}
        <Section title="ℹ️ Support & Legal">
          <View style={styles.menuContainer}>
            <MenuItem
              icon="❓"
              title="How to Play"
              onPress={() => Alert.alert("How to Play", "Tutorial flow")}
            />
            <MenuItem
              icon="📞"
              title="Help Center"
              onPress={() => Alert.alert("Help Center", "Support flow")}
            />
            <MenuItem
              icon="⭐"
              title="Rate Us"
              subtitle="Enjoying the app?"
              onPress={() => Alert.alert("Rate Us", "App store rating")}
            />
            <MenuItem
              icon="📄"
              title="Privacy Policy"
              onPress={() =>
                Alert.alert("Privacy Policy", "Privacy policy content")
              }
            />
            <MenuItem
              icon="📋"
              title="Terms of Service"
              onPress={() => Alert.alert("Terms", "Terms content")}
            />
            <MenuItem
              icon="ℹ️"
              title="About"
              subtitle={`Version 1.0.0 • Joined ${MOCK_USER.joinedDate}`}
              onPress={() => Alert.alert("About", "App info")}
              showArrow={false}
            />
          </View>
        </Section>

        {/* Danger Zone */}
        <Section title="⚠️ Danger Zone">
          <View style={styles.dangerContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
              <Text style={styles.deleteText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#37003C",
  },

  // Identity Card
  identityCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#37003C",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#00FF85",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  editAvatarButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#00FF85",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  editAvatarText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#37003C",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  teamBadge: {
    backgroundColor: "#F0EBFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#37003C",
    letterSpacing: 0.5,
  },
  regionBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  regionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2E7D32",
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#37003C",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 12,
  },

  // Section
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#37003C",
    marginBottom: 12,
  },

  // Trophy Cabinet
  trophiesContainer: {
    paddingRight: 16,
    gap: 12,
  },
  trophyCard: {
    backgroundColor: "#FFFFFF",
    width: 140,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00FF85",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trophyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  trophyName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#37003C",
    textAlign: "center",
    marginBottom: 4,
  },
  trophyDescription: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  trophyCardLocked: {
    backgroundColor: "#F5F5F5",
    width: 140,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  trophyIconLocked: {
    fontSize: 40,
    marginBottom: 8,
    opacity: 0.5,
  },
  trophyNameLocked: {
    fontSize: 13,
    fontWeight: "800",
    color: "#999",
    textAlign: "center",
  },

  // Season History
  seasonHistoryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 4,
  },
  seasonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  seasonName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#37003C",
  },
  seasonStats: {
    alignItems: "flex-end",
  },
  seasonRank: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    marginBottom: 2,
  },
  seasonPoints: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },

  // Preferences
  preferencesContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 4,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  preferenceIconText: {
    fontSize: 20,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#37003C",
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },

  // Menu Container
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#37003C",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  menuArrow: {
    fontSize: 24,
    fontWeight: "300",
    color: "#CCC",
  },

  // Danger Zone
  dangerContainer: {
    gap: 12,
  },
  logoutButton: {
    backgroundColor: "#FFF5F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFE0E0",
    gap: 8,
  },
  logoutIcon: {
    fontSize: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FF005A",
  },
  deleteButton: {
    backgroundColor: "#FFF0F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD0D0",
    gap: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#D32F2F",
  },
});
