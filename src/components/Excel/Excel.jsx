import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Excel.css';

function clone(o) {
    return JSON.parse(JSON.stringify(o))
}

class Excel extends Component {
    constructor(props) {
        super()
        const data = clone(props.initialData).map((row, idx) => {
            row.push(idx)
            return row
        })
        this.state = {
            data,
            sortby: null,
            descending: false,
            edit: null,
            search: false
        }

        this.preSearchData = null
        this.sort = this.sort.bind(this)
        this.showEditor = this.showEditor.bind(this)
        this.save = this.save.bind(this)
        this.toggleSearch = this.toggleSearch.bind(this)
        this.search = this.search.bind(this)
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
    toggleSearch() {
        if (this.state.search) {
            this.setState({
                data: this.preSearchData,
                search: false
            })
            this.preSearchData = null
        } else {
            this.preSearchData = this.state.data
            this.setState({
                search: true
            })
        }
    }
    search(e) {
        const needle = e.target.value.toLowerCase()
        if (!needle) {
            this.setState({ data: this.preSearchData })
            return
        }
        const idx = e.target.dataset.idx
        const searchdata = this.preSearchData.filter((row) => {
            return row[idx].toString().toLowerCase().indexOf(needle) > -1
        })
        this.setState({ data: searchdata })
    }
    render() {

        const searchRow = !this.state.search ? null : (
            <tr onChange={this.search}>
                {this.props.headers.map((_, idx) => (
                    <td key={idx}>
                        <input type="text" data-idx={idx} />
                    </td>
                ))}
            </tr>
        )

        return (
            <div>
                <button className='toolbar' onClick={this.toggleSearch}>
                    {this.state.search ? 'Hide search' : 'Show search'}
                </button>
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
                        {searchRow}
                        {this.state.data.map((row, rowidx) => {
                            const recordId = row[row.lenght - 1]
                            return (
                                <tr key={recordId} data-row={recordId}>
                                    {row.map((cell, columnidx) => {
                                        if (columnidx === this.props.headers.lenght) {
                                            return
                                        }

                                        const edit = this.state.edit
                                        if (edit && edit.row === recordId && edit.column === columnidx) {
                                            cell = (
                                                <form onSubmit={this.save}>
                                                    <input type="text" defaultValue={cell} />
                                                </form>
                                            )
                                        }
                                        return <td key={columnidx}>{cell}</td>
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>

                </table>
            </div>

        );
    }
}

Excel.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
}

export default Excel;