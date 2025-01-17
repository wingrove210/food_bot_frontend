import React from "react";
import qs from 'qs';
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {setCategoryId, setCurrentPage, setFilters} from "../redux/slices/filterSlice";
import Categories from "../components/Categories";
import PizzaBlock from "../components/PizzaBlock/pizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination";
import {SearchContext} from "../App";
import axios from "axios";


const Home = () => {
    
    const {categoryId, currentPage} = useSelector((state) => state.filter)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isSearch = React.useRef(false);
    const isMounted = React.useRef(false);
    
    const {searchValue} = React.useContext(SearchContext)
    const [items, setItems] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    
    const onChangeCategory = (id) => {
        dispatch(setCategoryId(id))
    }
    
    const onChangePage = number => dispatch(setCurrentPage(number))
    
    const filterSlice = async () => {
        setIsLoading(true);
        
        // из свойства удалить минус и добавляет свойство в переменную без минуса. Свойство в объекте не меняет
        const category = categoryId > 0 ? `category=${categoryId}` : '';
        console.log('категория' + category)
        
        try {
            const res = await axios.get(`https://653bd07fd5d6790f5ec77cbc.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=&order=`)
            setItems(res.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
        
    }
    
    // если изменили параметры и был первый рендер
    React.useEffect(() => {
        console.log('при изменениии параметров' + isMounted.current)
        if (isMounted.current) {
            const queryString = qs.stringify({
                categoryId,
                currentPage,
            });
            navigate(`?${queryString}`)
        }
        isMounted.current = true;
    }, [categoryId, searchValue, currentPage])
    
    
    // если был первый рендер, то проверяем url параметры и сохраняем в редуксе
    React.useEffect(() => {
        if(window.location.search) {
            const params = qs.parse(window.location.search.substring(1));
            // const sort = list.find(obj => obj.sortProperty === params.sortProperty)
            //
            dispatch(
                setFilters({
                    ...params,
                })
            )
            isSearch.current = true;
        }
    }, [])
    
    // если был первый рендер, то запрашиваем пиццы
    React.useEffect(() => {
        window.scrollTo(0, 0); // что бы при попадании на страницу, scroll был сверху, а не снизу
        console.log(isSearch.current)
        if (!isSearch.current) {
            filterSlice();
        }
        
        isSearch.current = false;
        
    }, [categoryId, searchValue, currentPage]);
    
    
    // constent
    let content = items.map((obj) => <PizzaBlock key={obj.id} {...obj}/>);
    if (isLoading) {
        content = [...new Array(6)].map((_, index) => <Skeleton key={index}/>);
    }
    
    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory = {onChangeCategory}/>
                {/*в данном случае мы используем onClickCategory и в качестве второго параметра закладываем стрелочную функцию которая
                возвращает id элементов категорий в данном случае это i см categories*/}
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
                {
                    content
                    
                    // items.map((obj) => isLouding ? <Skeleton/> : (<Index key={obj.id}{...obj}/>)
                    // Если одинаковое название параметров и json элементов можно сократить
                    // title={obj.title}
                    // price={obj.price}
                    // imageUrl={obj.imageUrl}
                    // sizes={obj.sizes}
                    // types={obj.types}
                    // )
                }
            </div>
            <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
        </div>
    )
}

export default Home;