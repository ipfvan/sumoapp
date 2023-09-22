import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatTanggal, formatTanggalInput } from '../../../../../../utils/LocalDateTime';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Antibiotik = () => {
  const [antibiotikList, setAntibiotikList] = useState([]);
  const [editedItems, setEditedItems] = useState({});
  const [editedQty, setEditedQty] = useState({});
  const [editedSatuan, setEditedSatuan] = useState({});
  const [editedExpired, setEditedExpired] = useState({});
  const convertToISODate = (ddmmyyyy) => {
    const parts = ddmmyyyy.split('/');
    const isoDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
    return isoDate;
  };
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    const fetchList = async (kategori, setList) => {
      try {
        const response = await axios.get(`/api/ciledug/main/barang?kategori=${kategori}`);
        const sortedData = response.data.sort((a, b) => a.urutan - b.urutan);
        setList(sortedData);
      } catch (error) {
        console.error(`Error fetching ${kategori} list: `, error);
      }
    };
    fetchList('Obat Antibiotik', setAntibiotikList);
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const updatedList = Array.from(antibiotikList);
    const [movedItem] = updatedList.splice(result.source.index, 1);
    updatedList.splice(result.destination.index, 0, movedItem);
    setAntibiotikList(updatedList);

    axios.post('/api/ciledug/main/update-order', { updatedList })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Error updating order:', error);
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  
    if (confirmDelete) {
      axios.delete(`/api/ciledug/main/barang?id=${id}`)
        .then(response => {
          console.log(response.data.message);
          const updatedList = antibiotikList.filter(item => item.id !== id);
          setAntibiotikList(updatedList);
        })
        .catch(error => {
          console.error('Error deleting item:', error);
        });
    }
  };

  const handleEdit = (id, column) => {
    let editedValue;
    
    switch (column) {
      case "item":
        editedValue = editedItems[id];
        break;
      case "qty":
        editedValue = editedQty[id];
        break;
      case "satuan":
        editedValue = editedSatuan[id];
        break;
      case "expired":
        editedValue = convertToISODate(editedExpired[id]);
        break;
      default:
        break;
    }
  
    if (editedValue !== undefined) {
      axios.put('/api/ciledug/main/barang', { id, column, updatedItem: editedValue })
        .then(response => {
          console.log(response.data.message);
          // Clear the edited value for the specific column and item ID
          switch (column) {
            case "item":
              setEditedItems({ ...editedItems, [id]: undefined });
              break;
            case "qty":
              setEditedQty({ ...editedQty, [id]: undefined });
              break;
            case "satuan":
              setEditedSatuan({ ...editedSatuan, [id]: undefined });
              break;
            case "expired":
              setEditedExpired({ ...editedExpired, [id]: undefined });
              break;
            default:
              break;
          }
          // Update the resepsionisList state to trigger a re-render
          setAntibiotikList(prevList => {
            const updatedList = prevList.map(item => {
              if (item.id === id) {
                return {
                  ...item,
                  [column]: editedValue
                };
              }
              return item;
            });
            return updatedList;
          });
        })
        .catch(error => {
          console.error('Error updating item:', error);
        });
    }
  };

  const handleNewItemChange = (event) => {
    setNewItemName(event.target.value);
  };


  const handleAddNewItem = () => {
    const fetchList = async (kategori, setList) => {
      try {
        const response = await axios.get(`/api/ciledug/main/barang?kategori=${kategori}`);
        const sortedData = response.data.sort((a, b) => a.urutan - b.urutan);
        setList(sortedData);
      } catch (error) {
        console.error(`Error fetching ${kategori} list: `, error);
      }
    };
  
    axios.post('/api/ciledug/main/barang', { kategori: 'Obat Antibiotik', item: newItemName })
      .then(response => {
        console.log(response.data.message);
        fetchList('Obat Antibiotik', setAntibiotikList);
        setNewItemName('');
      })
      .catch(error => {
        console.error('Error adding new item:', error);
      });
  };
  
  
  
  return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Antibiotik</h1>
          <DragDropContext onDragEnd={handleDragEnd}>
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2">Item</th>
                  <th className="border border-gray-400 px-4 py-2">Qty</th>
                  <th className="border border-gray-400 px-4 py-2">Satuan</th>
                  <th className="border border-gray-400 px-4 py-2">Exp</th>
                  <th className="border border-gray-400 px-4 py-2">Act</th>
                </tr>
              </thead>
              {antibiotikList.length > 0 && (
                <Droppable droppableId="itemList" type="ITEM">
                  {(provided) => (
                    <tbody {...provided.droppableProps} ref={provided.innerRef}>
                      {antibiotikList.map((antibiotik, index) => (
                        <Draggable
                          key={antibiotik.id.toString()}
                          draggableId={antibiotik.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <tr
                              className="text-center"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <td className="border border-gray-400 px-4 py-2 text-left">
                                {editedItems[antibiotik.id] !== undefined ? (
                                  <input
                                    type="text"
                                    value={editedItems[antibiotik.id]}
                                    onChange={(e) => {
                                      setEditedItems({
                                        ...editedItems,
                                        [antibiotik.id]: e.target.value,
                                      });
                                    }}
                                    onBlur={() => handleEdit(antibiotik.id, "item")}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditedItems({
                                        ...editedItems,
                                        [antibiotik.id]: antibiotik.item,
                                      });
                                    }}
                                  >
                                    {antibiotik.item}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
                                {editedQty[antibiotik.id] !== undefined ? (
                                  <input
                                    type="text"
                                    value={editedQty[antibiotik.id]}
                                    onChange={(e) => {
                                      setEditedQty({
                                        ...editedQty,
                                        [antibiotik.id]: e.target.value,
                                      });
                                    }}
                                    onBlur={() => handleEdit(antibiotik.id, "qty")}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditedQty({
                                        ...editedQty,
                                        [antibiotik.id]: antibiotik.saldo_qty,
                                      });
                                    }}
                                  >
                                    {antibiotik.saldo_qty}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
  {editedSatuan[antibiotik.id] !== undefined ? (
    <input
      type="text"
      value={editedSatuan[antibiotik.id]}
      onChange={(e) => {
        setEditedSatuan({
          ...editedSatuan,
          [antibiotik.id]: e.target.value,
        });
      }}
      onBlur={() => handleEdit(antibiotik.id, "satuan")}
    />
  ) : (
    <span
      onClick={() => {
        setEditedSatuan({
          ...editedSatuan,
          [antibiotik.id]: antibiotik.satuan,
        });
      }}
    >
      {antibiotik.satuan}
    </span>
  )}
</td>

<td className="border border-gray-400 px-4 py-2">
  {editedExpired[antibiotik.id] !== undefined ? (
    <input
      type="text"
      value={(editedExpired[antibiotik.id])}
      onChange={(e) => {
        setEditedExpired({
          ...editedExpired,
          [antibiotik.id]: e.target.value,
        });
      }}
      onBlur={() => handleEdit(antibiotik.id, "expired")}
    />
  ) : (
    <span
      onClick={() => {
        setEditedExpired({
          ...editedExpired,
          [antibiotik.id]: formatTanggal(antibiotik.expired),
        });
      }}
    >
      {formatTanggal(antibiotik.expired)}
    </span>
  )}
</td>

                          <td className="border border-gray-400">
                            <button
                              className="text-red-500"
                              onClick={() => handleDelete(antibiotik.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          )}
        </table>
      </DragDropContext>
      <div className="mt-4">

        <div className="flex space-x-2">
          <input
            type="text"
            value={newItemName}
            onChange={handleNewItemChange}
            className="border rounded-md px-2 py-1 w-full"
            placeholder="Nama Item Baru"
          />
          <button
            onClick={handleAddNewItem}
            className="bg-purple-900 text-white rounded-md px-4 py-2"
          >
            Tambah
          </button>
        </div>
      </div>
      </div>

  );
};

export default Antibiotik;
