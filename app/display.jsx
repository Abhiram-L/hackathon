import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
  Linking
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Display = ({ route }) => {
  // Extract data from navigation params
  const { data } = route.params || {};
  
  // Destructure the data for easier access
  const { imageUrl, analysis, videoResults, shoppingResults } = data || {};
  
  // Fallback for empty data
  if (!data || !analysis) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color="#f44336" />
        <Text style={styles.errorText}>No Data Available</Text>
        <Text style={styles.errorSubtext}>Please scan a product to view analysis</Text>
      </View>
    );
  }

  // Handle opening a video
  const handleOpenVideo = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  // Handle opening a shopping link
  const handleOpenShoppingLink = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with product name */}
      <LinearGradient
        colors={['#303f9f', '#1a237e']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          {analysis.productName || 'Product Analysis'}
        </Text>
      </LinearGradient>

      {/* Product image and introduction */}
      <View style={styles.productSection}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.productImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={50} color="#ccc" />
          </View>
        )}
        
        <Text style={styles.sectionTitle}>About this product</Text>
        <Text style={styles.introductionText}>
          {analysis.introduction || 'No product information available'}
        </Text>
      </View>

      {/* Ingredients section */}
      <View style={styles.ingredientsSection}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {analysis.ingredients && analysis.ingredients.length > 0 ? (
          analysis.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={[
                styles.ingredientDot, 
                { backgroundColor: ingredient.healthRating === 'Good' ? '#4caf50' : 
                                  ingredient.healthRating === 'Moderate' ? '#ff9800' : '#f44336' }
              ]} />
              <View style={styles.ingredientInfo}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                {ingredient.description && (
                  <Text style={styles.ingredientDescription}>{ingredient.description}</Text>
                )}
                {ingredient.alternatives && ingredient.alternatives.length > 0 && (
                  <View style={styles.alternativesContainer}>
                    <Text style={styles.alternativesLabel}>Alternatives:</Text>
                    {ingredient.alternatives.map((alt, altIdx) => (
                      <Text key={altIdx} style={styles.alternativeItem}>• {alt}</Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No ingredients information available</Text>
        )}
      </View>

      {/* Videos section */}
      {videoResults && videoResults.videos && videoResults.videos.length > 0 && (
        <View style={styles.videosSection}>
          <Text style={styles.sectionTitle}>Related Videos</Text>
          {videoResults.videos.map((video, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.videoItem}
              onPress={() => handleOpenVideo(video.url)}
            >
              {video.thumbnailUrl ? (
                <Image source={{ uri: video.thumbnailUrl }} style={styles.videoThumbnail} />
              ) : (
                <View style={styles.videoThumbnailPlaceholder}>
                  <MaterialIcons name="video-library" size={30} color="#ccc" />
                </View>
              )}
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                {video.channel && <Text style={styles.videoChannel}>{video.channel}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={24} color="#777" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Shopping section */}
      {shoppingResults && shoppingResults.shopping && shoppingResults.shopping.length > 0 && (
        <View style={styles.shoppingSection}>
          <Text style={styles.sectionTitle}>Shopping Options</Text>
          {shoppingResults.shopping.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.shoppingItem}
              onPress={() => handleOpenShoppingLink(item.url)}
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.shoppingItemImage} />
              ) : (
                <View style={styles.shoppingImagePlaceholder}>
                  <MaterialIcons name="shopping-bag" size={30} color="#ccc" />
                </View>
              )}
              <View style={styles.shoppingInfo}>
                <Text style={styles.shoppingItemName} numberOfLines={2}>{item.name}</Text>
                {item.price && <Text style={styles.shoppingItemPrice}>{item.price}</Text>}
                {item.store && <Text style={styles.shoppingItemStore}>{item.store}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={24} color="#777" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bottom padding */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
  },
  errorSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  productSection: {
    padding: 20,
    alignItems: 'center',
  },
  productImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 10,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 10,
    backgroundColor: '#202020',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  introductionText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
  },
  ingredientsSection: {
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  ingredientItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#303030',
  },
  ingredientDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 5,
    marginRight: 10,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  ingredientDescription: {
    fontSize: 14,
    color: '#bbb',
    lineHeight: 20,
  },
  alternativesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#303030',
  },
  alternativesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 4,
  },
  alternativeItem: {
    fontSize: 14,
    color: '#bbb',
    marginLeft: 5,
    lineHeight: 20,
  },
  videosSection: {
    padding: 20,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: 100,
    height: 56,
  },
  videoThumbnailPlaceholder: {
    width: 100,
    height: 56,
    backgroundColor: '#202020',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
    padding: 10,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  videoChannel: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 3,
  },
  shoppingSection: {
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  shoppingItemImage: {
    width: 80,
    height: 80,
  },
  shoppingImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#202020',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shoppingInfo: {
    flex: 1,
    padding: 10,
  },
  shoppingItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  shoppingItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 3,
  },
  shoppingItemStore: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 3,
  }
});

export default Display;