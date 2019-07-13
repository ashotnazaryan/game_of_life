import React, { Component } from 'react';
import './App.css';

export class App extends Component {

    _interval;

    constructor(props) {
        super(props);
        this.state = {
            size: 30,
            matrix: [],
            initialMatrix: [],
            aliveCells: [],
            processing: false
        };
    }

    initMatrix(count) {
        const matrix = [];
        for (let i = 0; i < count; i++) {
            matrix[i] = new Array(count);
            for (let j = 0; j < count; j++) {
                let item = {
                    x: j,
                    y: i,
                    coord: `x:${j}_y:${i}`,
                    alive: false
                };
                matrix[i][j] = item;
            }
        }
        this.setState({ matrix: matrix, initialMatrix: JSON.parse(JSON.stringify(matrix)) });
        setTimeout(() => {
            this.findAllNeighbours();
        });
    }

    findAllNeighbours() {
        const { matrix } = this.state;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                this.findNeighbours(matrix[i][j], matrix);
            }
        }
        // console.log("matrix: ", matrix);
    }

    findNeighbours(cell, matrix) {
        let neighbours = [
            (cell.y > 0 && cell.x > 0) && matrix[cell.y - 1][cell.x - 1],
            (cell.y > 0) && matrix[cell.y - 1][cell.x],
            (cell.y > 0 && cell.x < matrix[cell.x].length - 1) && matrix[cell.y - 1][cell.x + 1],
            (cell.x > 0) && matrix[cell.y][cell.x - 1],
            (cell.x < matrix[cell.x].length - 1) && matrix[cell.y][cell.x + 1],
            (cell.x > 0 && cell.y < matrix[cell.x].length - 1) && matrix[cell.y + 1][cell.x - 1],
            (cell.y < matrix[cell.y].length - 1) && matrix[cell.y + 1][cell.x],
            (cell.y < matrix[cell.y].length - 1) && matrix[cell.y + 1][cell.x + 1]
        ];
        neighbours = neighbours.filter(n => n);
        cell.neighbours = neighbours;
    }

    findAliveNeighbours(cell, matrix) {
        let aliveNeighbours = cell.neighbours.filter(n => n.alive);
        for (let i = 0; i < cell.neighbours.length; i++) {
            if (cell.alive && aliveNeighbours.length < 2) {
                cell.alive = false;
            }
            else if (cell.alive && (aliveNeighbours.length === 2 || aliveNeighbours.length === 3)) {
                cell.alive = true;
            }
            else if (cell.alive && aliveNeighbours.length > 3) {
                cell.alive = false;
            }
            else if (!cell.alive && aliveNeighbours.length === 3) {
                cell.alive = true;
            }
        }
        this.setState({ matrix: matrix });
    }

    setSize = () => {
        let { size } = this.state;
        if (size >= 3 && size <= 50) {
            this.setState({ size: size });
            this.initMatrix(size);
        }
    }

    updateInputValue = (event) => {
        this.setState({ size: +event.target.value });
    }

    componentDidMount() {
        this.initMatrix(30);
    }

    toggleCell = (cell) => {
        let { matrix, aliveCells } = this.state;
        cell.alive = !cell.alive;
        cell.alive ? aliveCells.push(cell) : aliveCells.splice(aliveCells.indexOf(cell), 1);
        this.setState({ matrix: matrix, aliveCells: aliveCells });
    }

    startGame = () => {
        this._interval = setInterval(() => {
            let { aliveCells, matrix } = this.state;
            this.setState({ processing: true });
            for (let i = 0; i < aliveCells.length; i++) {
                this.findNeighbours(aliveCells[i], matrix);
                this.findAliveNeighbours(aliveCells[i], matrix);
                this.setState({ matrix: matrix });
            }
        }, 1000);
    }

    stopGame = () => {
        clearInterval(this._interval);
        this.setState({ processing: false });
    }

    resetBoard = () => {
        const { initialMatrix } = this.state;
        clearInterval(this._interval);
        this.setState({ processing: false, matrix: initialMatrix });
    }

    render() {
        const { matrix, processing, size } = this.state;
        return (
            <div className="App">
                <div className="board-container">
                    <div className="size-container">
                        <input type="number" value={size} onChange={(event) => this.updateInputValue(event)} />
                        <button onClick={() => this.setSize(size)}>Set size</button>
                    </div>
                    <div className="board">
                        {
                            matrix.map((rows, index) => {
                                return (
                                    <div key={rows[index].coord} className="row">
                                        {
                                            rows.map((cell) => {
                                                return (
                                                    <div key={cell.coord}
                                                        className={`cell ${cell.alive ? 'alive' : ''}`}
                                                        onClick={() => this.toggleCell(cell)}
                                                    >

                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            }
                            )}
                    </div>
                    <div className="actions">
                        <button onClick={() => this.resetBoard()}>Reset board</button>
                        {
                            processing ?
                                (
                                    <button onClick={() => this.stopGame()}>Stop game</button>
                                )
                                :
                                (
                                    <button onClick={() => this.startGame()}>Start game</button>
                                )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
