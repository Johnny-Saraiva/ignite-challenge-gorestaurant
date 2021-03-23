import { useEffect, useState } from 'react';
import Food from '../../components/Food';
import Header from '../../components/Header';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import api from '../../services/api';
import { IFood } from '../../types';
import { FoodsContainer } from './styles';

function Dashboard () {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');

      setFoods(response.data);
    }
    loadFoods();
  }, []);

  const handleAddFood = async (food: IFood) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data]);
    } catch {
      console.log('Erro na adição de uma nova comida.');
    }
  }

  const handleUpdateFood = async (food: IFood) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, { 
        ...editingFood, 
        ...food 
      });

      const foodsUpdated = foods.map(food =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data,
      );

      console.log('Comida atualizada com sucesso.');
      setFoods(foodsUpdated);
    } catch {
      console.log('Erro na atualização de uma nova comida.');
    }
  }

  const handleDeleteFood = async (id: number) => {
    try {
      await api.delete(`/foods/${id}`);
      const foodsFiltered = foods.filter(food => food.id !== id);
      setFoods(foodsFiltered);
      console.log('Comida removida com sucesso.');
    } catch {
      console.log('Erro ao tentar remover a comida.');
    }
  }

  const handleEditFood = (food: IFood) => {
    setEditingFood(food);
    setEditModalOpen(!editModalOpen);
  }

  return (
    <>
      <Header openModal={() => setModalOpen(!modalOpen)} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={() => setModalOpen(!modalOpen)}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={() => setEditModalOpen(!editModalOpen)}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDeleteFood={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
