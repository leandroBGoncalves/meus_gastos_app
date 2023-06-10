import { 
    useContext, 
    useEffect, 
    useRef, 
    useState
} from 'react';

import { 
    Dimensions, 
    Text, 
    View, 
    StyleSheet 
} from 'react-native';

import Carousel from 'react-native-snap-carousel';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import { AuthContext } from '../../context/contextProvider';

import Filters from '../../libs/Filters';

export function CardSummary() {
    const {
        transactionsByUser,
    } = useContext(AuthContext);
    const isCarousel = useRef(null)
    const [dataBalance, setDataBalance] = useState([]);

    
    const SLIDER_WIDTH = Dimensions.get('window').width
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8)

    function findDate(date) {
        let filtered = date.find(item => {return moment(item).format('MM-YYYY') === moment().format('MM-YYYY')})
        if (filtered) {
            return true;
        } else {
            return false;
        }
    }
    
    function calcSummary() {
        let calcCards = transactionsByUser?.reduce((acc, item) => {
            if (item.category === "expense" && findDate(item.due_dates)) {
                acc[1].expenses += item.amount;
                acc[2].balance -= item.amount;
            } else if (item.category === "income" && findDate(item.due_dates)) {
                acc[0].incomes += item.amount;
                acc[2].balance += item.amount;
            }
            return acc;
        }, 
        [
            {incomes: 0},
            {expenses: 0},
            {balance: 0},
        ])

        setDataBalance(calcCards);
    }

    useEffect(() => {
        calcSummary();
    }, [transactionsByUser])

    const styles = estilo(ITEM_WIDTH)

    function RenderItem({item, index}) {
        function renderTitle() {
            switch (Object.keys(item)[0]) {
                case 'incomes':
                    return 'Entradas';
                case 'expenses':
                    return 'Saidas'
                case 'balance':
                    return 'Previsão'      
                default:
                    break;
            }
        };
        function renderIcom() {
            switch (Object.keys(item)[0]) {
                case 'incomes':
                    return 'plus-thick';
                case 'expenses':
                    return 'exit-to-app'
                case 'balance':
                    return 'wallet-plus-outline'      
                default:
                    break;
            }
        };

        return (
            <View style={(Object.keys(item)[0] === 'expenses' || Object.values(item)[0] < 0) ? styles.slideExpense : styles.slide}>
                <Text style={styles.title}>{ renderTitle() }</Text>
                <View style={styles.boxValue}>
                    <MaterialCommunityIcons 
                        name={renderIcom()}
                        size={40} 
                        color={'#FFFFFF'}
                    />
                    <Text style={styles.value}>{ Filters.convertMoneyTextMask(Object.values(item)) }</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.containerCard}>
            <Carousel
              ref={isCarousel}
              data={dataBalance}
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
        borderColor: '#70e000',
        backgroundColor: 'rgba(112, 224, 0, 0.9)',
        borderWidth: 0.8,
      },
      slideExpense: {
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
        borderColor: '#ef233c',
        backgroundColor: 'rgba(239, 35, 60, 0.9)',
        borderWidth: 0.8,
      },
      title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "bold",
        paddingLeft: 20,
        paddingTop: 20
      },
      boxValue: {
        width: '100%',
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
      },
      value: {
        color: "#FFFFFF",
        fontSize: 35,
        fontWeight: "bold",
        paddingRight: 20,
      },
})