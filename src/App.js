import React, { Component } from 'react';
import './App.css';

export class App extends Component {

    _interval;

    constructor(props) {
        super(props);
        this.state = {
            matrix: [],
            aliveCells: [],
            started: false
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
        this.setState({ matrix: matrix });
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

    componentDidMount() {
        this.initMatrix(30);
    }

    toggleCell = (cell) => {
        let { matrix, aliveCells } = this.state;
        cell.alive = !cell.alive;
        cell.alive ? aliveCells.push(cell) : aliveCells.splice(aliveCells.indexOf(cell), 1);
        this.setState({ matrix: matrix, aliveCells: aliveCells });
        // console.log("matrix: ", matrix);
    }

    startGame = () => {
        let { aliveCells, matrix } = this.state;
        this.setState({ started: true });
        for (let i = 0; i < aliveCells.length; i++) {
            this.findNeighbours(aliveCells[i], matrix);
            this._interval = setInterval(() => {
                this.findAliveNeighbours(aliveCells[i], matrix);
                this.setState({ matrix: matrix });
                console.log("interval: ", matrix);
            }, 1000);
        }
    }

    stopGame = () => {
        const { matrix } = this.state;
        clearInterval(this._interval);
        this.setState({ started: false });
        console.log("stop game: ", matrix);
    }

    resetBoard = () => {
        const { matrix } = this.state;
        clearInterval(this._interval);
        this.initMatrix(30);
        this.setState({ started: false });
        console.log("reset board: ", matrix);
    }

    render() {
        const { matrix, started } = this.state;
        return (
            <div className="App">
                <div className="board-container">
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
                        started ?
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
        )
    }
}

export default App;
