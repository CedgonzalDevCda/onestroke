import { Pressable, Text, StyleSheet, View } from "react-native"
import { useState } from "react"
import { router } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

import { progression } from "@/src/meta/progression/ProgressionService"
import StarsProgress from "./StarsProgress"
import LockedIcon from "@/assets/gameimg/locked-icon.svg"
import PurchaseModal from "./PurchaseModal"

export default function LevelItem({ worldId, level }: any) {
  const [showModal, setShowModal] = useState(false)
  const [, forceRefresh] = useState(0)

  // --- STATE LOGIC ---
  const isUnlocked = progression.isLevelUnlocked(worldId, level.id)
  const stars = progression.getStars(level.id)
  const isCompleted = progression.isLevelCompleted(level.id) // Basé sur l'existence dans completedLevels

  // maxStars réel du niveau (peut être 0 pour certains niveaux)
  const maxStars = level.maxStars ?? 3

  // Un niveau est "pleinement complété" (fond doré) si :
  // - il est terminé
  // - ET (soit il n'a aucune étoile à obtenir, soit toutes les étoiles sont obtenues)
  const isFullCompleted = isCompleted && (maxStars === 0 || stars >= maxStars)

  // --- ACTIONS ---
  const openLevel = () => {
    router.push({
      pathname: "/play",
      params: {
        worldId,
        levelId: level.id,
      },
    })
  }

  const handlePress = () => {
    if (!isUnlocked) return setShowModal(true)
    openLevel()
  }

  const handleBuy = async () => {
    const success = await progression.unlockLevel(worldId, level.id)

    if (!success) {
      alert("Not enough gold")
      return
    }

    setShowModal(false)
    forceRefresh(v => v + 1)
  }

  // --- UI HELPERS ---
  const renderContent = () => {
    if (!isUnlocked) {
      return <LockedIcon width={18} height={18} />
    }

    return (
      <>
        <Text style={styles.levelText}>
          {level.name.replace("Level ", "")}
        </Text>
        {stars > 0 && maxStars > 0 && (
          <StarsProgress stars={stars} maxStars={maxStars} />
        )}
      </>
    )
  }

  const fillStyle = !isUnlocked
    ? styles.locked
    : isCompleted
    ? styles.completed
    : styles.available

  // --- RENDER ---
  return (
    <>
      <Pressable style={styles.level} onPress={handlePress}>
        {isFullCompleted ? (
          <LinearGradient
            colors={["#FFFFAA", "#FFA666"]}
            style={styles.gradientFill}
          >
            {renderContent()}
          </LinearGradient>
        ) : (
          <View style={[styles.inner, fillStyle]}>
            {renderContent()}
          </View>
        )}
      </Pressable>

      <PurchaseModal
        visible={showModal}
        price={50}
        onCancel={() => setShowModal(false)}
        onConfirm={handleBuy}
      />
    </>
  )
}

const styles = StyleSheet.create({
  level: {
    width: 70,
    height: 70,
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
  },

  gradientFill: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  inner: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  levelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  available: {
    backgroundColor: "#fff",
  },

  completed: {
    backgroundColor: "#BBDEC5",
  },

  locked: {
    backgroundColor: "#000",
  },
})