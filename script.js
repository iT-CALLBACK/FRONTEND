// объект Player
class Player {
  constructor(symbol) {
    // Присваиваем символ игрока
    this.symbol = symbol;
  }
}

// объект Board
class Board {
  constructor() {
    // Получаем все клетки игрового поля
    this.cells = Array.from(document.querySelectorAll('.cell'));
  
    // Устанавливаем выигрышные комбинации для игры
    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
  }

  // Отображаем пустое поле
  render() {
    this.cells.forEach(cell => cell.textContent = '');
  }

  // Обновляем содержимое клетки по индексу и символу игрока
  updateCell(index, symbol) {
    this.cells[index].textContent = symbol;
  }

  // Проверяем, есть ли победитель по текущему символу
  checkWinner(symbol) {
    return this.winningCombinations.some(combination => {
      return combination.every(index => this.cells[index].textContent === symbol);
    });
  }

  // Подсвечиваем выигрышную линию
  highlightWinningLine(symbol) {
    const winningCombination = this.winningCombinations.find(combination => {
      return combination.every(index => this.cells[index].textContent === symbol);
    });
    if (winningCombination) {
      winningCombination.forEach(index => {
        this.cells[index].classList.add('winning');
      });
    }
  }

  // Сбрасываем состояние поля и убираем подсветку
  reset() {
    this.cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('winning');
    });
  }
}

// объект Game
class Game {
  constructor() {
    // Инициализируем игровое поле и игроков
    this.board = new Board();
    this.players = [new Player('X'), new Player('O')];
    this.currentPlayerIndex = 0;
    this.isGameOver = false;

    // Добавляем обработчики событий для клеток поля и кнопки сброса
    this.board.cells.forEach(cell => cell.addEventListener('click', this.handleMove.bind(this)));
    document.getElementById('reset').addEventListener('click', this.resetGame.bind(this));
  }

  // Получаем текущего игрока
  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  // Обрабатываем ход игрока
  handleMove(event) {
    if (this.isGameOver) return; // Прекращаем обработку, если игра окончена
    const cell = event.target;
    const index = cell.dataset.index;
    if (cell.textContent !== '') return; // Не позволяем повторно ходить в занятую клетку

    const currentPlayer = this.getCurrentPlayer();
    this.board.updateCell(index, currentPlayer.symbol); // Обновляем клетку символом текущего игрока

    if (this.board.checkWinner(currentPlayer.symbol)) {
      this.isGameOver = true;
      this.board.highlightWinningLine(currentPlayer.symbol); // Подсвечиваем выигрышную комбинацию
      setTimeout(() => alert(`Победил ${currentPlayer.symbol}`), 100); // Показываем сообщение о победе
    } else {
      this.switchPlayer(); // Переключаем на следующего игрока
    }
  }

  // Переключаем текущего игрока
  switchPlayer() {
    this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;
  }

  // Сбрасываем игру до начального состояния
  resetGame() {
    this.board.reset(); // Сбрасываем поле
    this.isGameOver = false; // Сбрасываем статус игры
    this.currentPlayerIndex = 0; // Устанавливаем первого игрока
  }
}

// Запускаем игру
const game = new Game();