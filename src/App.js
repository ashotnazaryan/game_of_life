import React, { Component } from 'react';
import './App.css';

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            matrix: [],
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
        // matrix.forEach((rows) => {
        //     rows.forEach((cell) => {
        //         this.findNeighbours(cell, selfMatrix);
        //     });
        // });
        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++) {
                this.findNeighbours(matrix[i][j], matrix);
            }
        }
    }

    findNeighbours(cell, matrix) {
        let neighbours = [
            (cell.y > 0 && cell.x > 0) && matrix[cell.y-1][cell.x-1], 
            (cell.y > 0) && matrix[cell.y-1][cell.x], 
            (cell.y > 0 && cell.x < matrix[cell.x].length - 1) && matrix[cell.y-1][cell.x+1],
            (cell.x > 0) && matrix[cell.y][cell.x-1], 
            (cell.x < matrix[cell.x].length - 1) && matrix[cell.y][cell.x+1],
            (cell.x > 0 && cell.y < matrix[cell.x].length - 1) && matrix[cell.y+1][cell.x-1], 
            (cell.y < matrix[cell.y].length - 1) && matrix[cell.y+1][cell.x], 
            (cell.y < matrix[cell.y].length - 1) && matrix[cell.y+1][cell.x+1]
        ];
        neighbours = neighbours.filter(n => n);
        cell.neighbours = neighbours;
    }

    componentDidMount() {
        this.initMatrix(10);
    }

    toggleCell = (cell) => {
        const { matrix } = this.state;
        cell.alive = !cell.alive;
        this.setState({ matrix: matrix });
        console.log("matrix: ", matrix);
    }

    startGame = () => {
        this.setState({ started: true });
    }

    resetBoard = () => {
        this.initMatrix(10);
    }

    render() {
        const { matrix } = this.state;
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
                    <button onClick={() => this.startGame()}>Start game</button>
                    <button onClick={() => this.resetBoard()}>Reset board</button>
                </div>
            </div>
        )
    }
}

export default App;
