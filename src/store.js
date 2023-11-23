/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = {
      ...initState,
      list: [],
      selectionsCount: {},
    };
    this.listeners = [];
    this.itemCounter = 1; // счетчик для генерации уникальных кодов
  }
  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener();
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    const newItem = {
      code: this.itemCounter++,
      title: 'Новая запись',
    };

    this.setState({
      ...this.state,
      list: [...this.state.list, newItem],
    });
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.filter(item => item.code !== code),
    });
  }

  /**
   * Выделение записи по коду
   * @param code
   */
  selectItem(code) {
    const updatedList = this.state.list.map(item => {
      const isSelected = item.code === code;
      return {
        ...item,
        selected: isSelected ? !item.selected : false,
        selectionsCount: isSelected
          ? (item.selectionsCount || 0) + 1
          : item.selectionsCount || 0,
      };
    });

    const selectionsCount = updatedList.reduce((count, item) => {
      count[item.title] = item.selectionsCount || 0;
      return count;
    }, {});

    this.setState({
      ...this.state,
      list: updatedList,
      selectionsCount: selectionsCount,
    });
  }
}

export default Store;
