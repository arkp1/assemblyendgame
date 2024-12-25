import React from "react";
import { languages } from "./languages";
import { useState } from "react";
import { clsx } from "clsx";
import Confetti from "react-confetti";
import { getFarewellText, randomWord } from "./utils";

export default function AssemblyEndgame() {
  //Word  Logic
  //State values
  const [currentWord, setCurrentWord] = useState(() => randomWord());
  const [guessedLetter, setGuessedLetter] = useState([]);

  //derived values
  const wrongGuessCount = guessedLetter.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const lastGuessedLetter = guessedLetter[guessedLetter.length - 1];
  const lastGuessedLetterIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  //game won or lost logic
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetter.includes(letter));

  const isGameLost = wrongGuessCount >= 8;

  const isGameOver = isGameWon || isGameLost;

  //static variable
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addLetterClick(letter) {
    setGuessedLetter((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
    );
  }

  //KEYBOARD
  const keyboardElements = alphabet.split("").map((letter, index) => {
    const isGuessed = guessedLetter.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        key={index}
        className={className}
        disabled={isGameOver}
        aria-label={`letter ${letter}`}
        aria-disabled={guessedLetter.includes(letter)}
        onClick={() => addLetterClick(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  //Mapping over and Splitting the word / WORD
  const letterElements = currentWord.split("").map((letter, index) => {
    {
      return (
        <span key={index}>
          {isGameOver
            ? letter.toUpperCase()
            : guessedLetter.includes(letter)
            ? letter.toUpperCase()
            : ""}
        </span>
      );
    }
  });

  //language card logic / CARDS
  const languageElements = languages.map((language, index) => {
    const isLanguageLost = index < wrongGuessCount;
    const className = clsx("card", {
      lost: isLanguageLost,
    });

    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };
    return (
      <span key={language.name} className={className} style={styles}>
        {language.name}
      </span>
    );
  });

  //GAME STATUS WON,LOST OR INCORRECT
  function gameStatusMessage() {
    if (!isGameOver && lastGuessedLetterIncorrect)
      return (
        <>
          <p>{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
        </>
      );
    if (isGameWon)
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
          <Confetti 
          recycle={false}
          numberOfPieces={1000}
          />
        </>
      );
    if (isGameLost)
      return (
        <>
          <h2>You Lost!</h2>
          <p>Better luck next time</p>
        </>
      );
  }

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    incorrect: !isGameOver && lastGuessedLetterIncorrect,
    null: null,
  });

  function startNewGame() {
    setCurrentWord(randomWord());
    setGuessedLetter([]);
  }

  //JSX OF THE PAGE
  return (
    <>
      <main>
        <header>
          <h1>Assembly: Endgame</h1>
          <p>Guess the word in under 8 attempts.</p>
        </header>

        <section className={gameStatusClass}>{gameStatusMessage()}</section>

        <section className="language-cards">{languageElements}</section>
        <section className="word">{letterElements}</section>
        <section className="keyboard">{keyboardElements}</section>
        {isGameOver && (
          <button className="new-game" onClick={startNewGame}>
            New Game
          </button>
        )}
      </main>
    </>
  );
}
