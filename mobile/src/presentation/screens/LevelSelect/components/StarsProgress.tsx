import { View, StyleSheet } from "react-native"
import StarCompleted from "@/assets/gameimg/star-completed.svg"
import StarEmpty from "@/assets/gameimg/star-not-completed.svg"

export default function StarsProgress({
  stars,
  maxStars
}: {
  stars: number
  maxStars: number
}) {
  // Si aucune étoile obtenue, on n'affiche rien du tout
  if (stars === 0) {
    return null
  }

  return (
    <View style={styles.row}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const StarIcon = i < stars ? StarCompleted : StarEmpty
        return <StarIcon key={i} width={20} height={20} />
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
})