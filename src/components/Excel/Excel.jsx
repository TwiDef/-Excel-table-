import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Excel.css';

function clone(o) {
    return JSON.parse(JSON.stringify(o))
}

class Excel extends Component {
    constructor(props) {
        super()
        this.state = {
            data: props.initialData,
            sortby: null,
            descending: false,
            edit: null
        }
        this.sort = this.sort.bind(this)
        this.showEditor = this.showEditor.bind(this)
        this.save = this.save.bind(this)
    }
    save(e) {
        e.preventDefault()
        const input = e.target.firstChild
        const data = clone(this.state.data)
        data[this.state.edit.row][this.state.edit.column] = input.value

        this.setState({
            edit: null,
            data
        })
    }
    showEditor(e) {
        this.setState({
            edit: {
                row: parseInt(e.target.parentNode.dataset.row, 10),
                column: e.target.cellIndex
            }
        })
    }
    sort(e) {
        const column = e.target.cellIndex
        const data = clone(this.state.data)
        const descending = this.state.sortby === column && !this.state.descending

        data.sort((a, b) => {
            if (a[column] === b[column]) return 0
            return descending
                ? a[column] < b[column]
                    ? 1
                    : -1
                : a[column] > b[column]
                    ? 1
                    : -1
        })

        this.setState({
            data,
            sortby: column,
            descending
        })
    }
    render() {
        return (
            <table className='table'>

                <thead onClick={this.sort}>
                    <tr>
                        {this.props.headers.map((title, idx) => {
                            if (this.props.sortby === idx) {
                                title += this.state.descending ? "\u2191" : "\u2193"
                            }
                            return <th key={idx}>{title}</th>
                        })}
                    </tr>
                </thead>

                <tbody onDoubleClick={this.showEditor}>
                    {this.state.data.map((row, rowidx) => (
                        <tr key={rowidx} data-row={rowidx}>
                            {row.map((cell, columnidx) => {
                                const edit = this.state.edit

                                if (edit && edit.row === rowidx && edit.column === columnidx) {
                                    cell = (
                                        <form onSubmit={this.save}>
                                            <input type="text" defaultValue={cell} />
                                        </form>
                                    )
                                }
                                return <td key={columnidx}>{cell}</td>
                            })}
                        </tr>
                    ))}
                </tbody>

            </table>
        );
    }
}

Excel.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
}

export default Excel;