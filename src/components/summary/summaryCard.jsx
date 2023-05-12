import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Dimensions, Text, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import Filters from '../../libs/Filters';

export function CardSummary() {
    const isCarousel = useRef(null)

    
    const SLIDER_WIDTH = Dimensions.get('window').width
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8)
    
    const data = [
        {
            title: "Saidas",
            body: 6875.29,
            category: "expenses",
        },
        {
            title: "Entradas",
            body: 7500,
            category: "amount",
        },
        {
            title: "Previsão",
            body: 253.25,
            category: "balance",
        },
    ]
    
    const styles = estilo(ITEM_WIDTH)

    function RenderItem({item, index}) {
        return (
            <View style={styles.slide}>
                <Text style={styles.title}>{ item.title }</Text>
                <View style={styles.boxValue}>
                    <Text style={styles.value}>{ Filters.convertMoneyTextMask(item.body) }</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.containerCard}>
            <Carousel
              ref={isCarousel}
              data={data}
              renderItem={RenderItem}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              layout={'stack'} 
              layoutCardOffset={18}
              firstItem={2}
            />
        </View>
    )
}

const estilo = (ITEM_WIDTH) => StyleSheet.create({
    containerCard: {
        height: 200,
    },

    slide: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: ITEM_WIDTH,
        height: 150,
        marginTop: 10,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: {
          width: -2,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
      },
      title: {
        color: "#222",
        fontSize: 28,
        fontWeight: "bold",
        paddingLeft: 20,
        paddingTop: 20
      },
      boxValue: {
        width: '100%',
        padding: 10,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      },
      value: {
        color: "#222",
        fontSize: 35,
        fontWeight: "bold",
        paddingRight: 20,
      },
})