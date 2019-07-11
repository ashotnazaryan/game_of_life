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

    initmatrix(count) {
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
        matrix[1][1] = {
            ...matrix[1][1],
            alive: true
        }
        this.setState({ matrix: matrix });
        setTimeout(() => {
            this.findAllNeighbours();
        });
    }

    findAllNeighbours() {
        const { matrix } = this.state;
        let allCells = [].concat(...matrix);
        let neighbours = [];
        matrix.map((rows, indexRow, selfMatrix) => {
            const tempMatrix = JSON.parse(JSON.stringify(selfMatrix));
            rows.map((cell, index, selfRows) => {
                const tempColumns = tempMatrix[selfMatrix.length - 1 - indexRow];
                const tempRows = JSON.parse(JSON.stringify(selfRows));
                let neighbours_x = tempRows.filter((s, i, sf) => cell.x === i - 1 || cell.x === i + 1);
                let neighbours_y = tempColumns.filter((s, i, sf) => cell.y === i - 1 || cell.y === i + 1);
                debugger
                // cell.neighbours = tempRows.filter((s, i) => cell.x === i - 1 || cell.x === i + 1);
                // console.log(allCells, rows, indexRow, selfMatrix, cell, index, selfRows);
                return cell;
            });
            return rows;
        });
        // let allCellCopy = JSON.parse(JSON.stringify(allCells));
        // allCells.map((cell, index, self) => {
        //     cell.neighbours = allCellCopy.filter((s, i) => (cell.x === i - 1 || cell.x === i + 1) && cell.x <= self.length - 1);
        // });
        console.log("matrix: ", matrix);
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.initmatrix(10);
    }

    toggleCell = (cell) => {
        let { matrix } = this.state;
        cell.alive = !cell.alive;
        this.setState({ matrix: matrix });
    }

    startGame = () => {
        this.setState({ started: true });
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
                <button onClick={() => this.startGame()}>Start game</button>
            </div>
        )
    }
}

export default App;
