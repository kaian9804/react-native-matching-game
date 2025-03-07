import React, { Component } from 'react'
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'

import Card from './Card'

class App extends Component {
  state = {
    cardSymbols: [
      '😬', '🤩', '😎', '💕', '❤️', '⭐️', '🤪', '👍'
    ],
    cardSymbolsInRand: [],
    isOpen: [],
    firstPickedIndex: null,
    secondPickedIndex: null,
    steps: 0,
    isEnded: false,
  }

  componentDidMount() {
    // Duplicate Symbols x 2
    let newCardSymbols = [...this.state.cardSymbols, ...this.state.cardSymbols]
    let cardSymbolsInRand = this.shuffleArray(newCardSymbols)
  
     // Init isOpen Array according to the length of symbol array
     let isOpen = []
     for (let i = 0; i < newCardSymbols.length; i++) {
       isOpen.push(false)
     }
  
    this.setState({
      cardSymbolsInRand: cardSymbolsInRand,
       isOpen: isOpen,
    })
  }

  cardPressHandler = (index) => {
    let newIsOpen = [...this.state.isOpen]

    // check if the picked one is already picked
    if (newIsOpen[index]) {
      return;
    }

    newIsOpen[index] = true

    // Check the current game flow
    if (this.state.firstPickedIndex == null && this.state.secondPickedIndex == null) {
      // First Choice
      this.setState({
        isOpen: newIsOpen,
        firstPickedIndex: index,
      })
    } else if (this.state.firstPickedIndex != null && this.state.secondPickedIndex == null) {
      // Second Choice
      this.setState({
        isOpen: newIsOpen,
        secondPickedIndex: index,
      })
      // when you pick two cards for matching, it will be counted as one attempted.
      this.setState({
        steps: this.state.steps + 1,
      })
    }
  }

  shuffleArray = (arr) => {
    const newArr = arr.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr
  };

  calculateGameResult = () => {
    if (this.state.firstPickedIndex != null && this.state.secondPickedIndex != null) {
      
      // Calculate if the game is ended
      if (this.state.cardSymbolsInRand.length > 0) {
        let totalOpens = this.state.isOpen.filter((isOpen) => isOpen)
        if (totalOpens.length == this.state.cardSymbolsInRand.length) {
          this.setState({
            isEnded: true,
          })
          return
        }
      }

      // Determind if two card are the same
      let firstSymbol = this.state.cardSymbolsInRand[this.state.firstPickedIndex]
      let secondSymbol = this.state.cardSymbolsInRand[this.state.secondPickedIndex]
  
      if (firstSymbol != secondSymbol) {
        // Incorrect, uncover soon
        setTimeout(() => {
          let newIsOpen = [...this.state.isOpen]
          newIsOpen[this.state.firstPickedIndex] = false
          newIsOpen[this.state.secondPickedIndex] = false
  
          this.setState({
            firstPickedIndex: null,
            secondPickedIndex: null,
            isOpen: newIsOpen
          })
        }, 1000)
      } else {
        // Correct
        this.setState({
          firstPickedIndex: null,
          secondPickedIndex: null,
        })
      }
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevState.secondPickedIndex != this.state.secondPickedIndex) {
      this.calculateGameResult()
    }
  }
  
  render() {
    return (
      <>
        <StatusBar />
        <SafeAreaView style={ styles.container }>
          <View style={ styles.header }>
            <Text style={styles.heading}>
              Emoji 😎{'\n'}Matching Game
            </Text>
          </View>
          <View style={ styles.main }>
          <View style={ styles.gameBoard }>
            {this.state.cardSymbolsInRand.map((symbol, index) => 
              <Card key={index} style={ styles.button } onPress={ () => this.cardPressHandler(index) } fontSize={30} title={symbol} cover="❓" isShow={this.state.isOpen[index]}></Card>
            )}
          </View>
          </View>
          <View style={ styles.footer }>
            <Text style={ styles.footerText }>
              {this.state.isEnded
                ? `Congrats! You have completed in ${this.state.steps} steps.`
                : `You have tried ${this.state.steps} time(s).`
              }
            </Text>

              {/* {this.state.isEnded ?
                <TouchableOpacity onPress={ this.resetGame } style={ styles.tryAgainButton }>
                  <Text style={ styles.tryAgainButtonText }>Try Again</Text>
                </TouchableOpacity>
              : null} */}

            <Text style={styles.creator}>
              {'\n'}
              Ka Ian @ 2024 - React Native
            </Text>

            

            

          </View>
        </SafeAreaView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
  },
  main: {
    flex: 3,
    backgroundColor: '#42cfcf',
  },
  footer: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  footerText: {
    fontSize: 20,
    textAlign: 'center',
  },
  gameBoard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexWrap: 'wrap',
    alignContent: 'center',
    margin: (Dimensions.get('window').width - (48 * 4)) / (4 * 2) - (4 * 2),
  },
  button: {
    backgroundColor: '#eee',
    borderRadius: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    margin: (Dimensions.get('window').width - (48 * 4)) / (4 * 2) - (4 * 2),
  },
  buttonText: {
    fontSize: 30,
  },
  tryAgainButton: {
    backgroundColor: '#42cfcf',
    padding: 8,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tryAgainButtonText: {
    fontSize: 18,
  },
  creator: {
    fontSize: 10,
  }
})

export default App 