import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPizza = createAsyncThunk(
    'pizza/fetchPizzasStatus',
    async (params) => {
        const {sortBy, order, category, search, currentPage} = params;
        const {data} = await axios.get(
            `https://653bd07fd5d6790f5ec77cbc.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
            );
        return data
    },
)

const initialState = {
    items: [],
}

const pizzaSlice = createSlice({
    name: 'pizza',
    initialState,
    reducers: {
        setItems(state, action) {
            state.items = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPizza.pending, (state) => {
                state.status = "loading"
                state.items = []
            })
            .addCase(fetchPizza.fulfilled, (state, action) => {
                state.items = action.payload
                state.status = "success"
            })
            .addCase(fetchPizza.rejected, (state) => {
                state.status = "error"
                state.items = []
            })
    }
});

export const {setItems} = pizzaSlice.actions;

export default pizzaSlice.reducer