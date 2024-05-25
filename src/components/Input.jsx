import Select, { components } from "react-select";
import { useQuery } from "react-query";
import { useState } from "react";
import Loader from "./Loader";

// Checkbox bileşeni
const CheckboxOption = (props) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center border-b">
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />
        <div></div>
        <div style={{ marginLeft: "10px" }}>{props.children}</div>
      </div>
    </components.Option>
  );
};

const Input = () => {
  // value değerlerini select alanı için state tuttuk
  const [value, setValue] = useState([]);

  // API'den istek yap
  const fetchData = async () => {
    const response = await fetch("https://rickandmortyapi.com/api/character");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  // İsloading, İsError olaylarını izle
  const { data, isLoading, isError, error } = useQuery("users", fetchData);
  if (isLoading) return <Loader />; // Veriler yüklenirken gösterilecek içerik
  if (isError) return <p>Hata: {error.message}</p>; // Hata durumunda gösterilecek içerik

  // Select alanı için options dön
  const options = data.results.map((user) => ({
    value: user.id,
    label: user.name, // Görüntülenecek isim
    image: user.image, // Karakter resmi
    episodes: user.episode.length, // Karakterin göründüğü bölüm sayısı
  }));

  // Select alanı için değişme olayını izle
  const handleChange = (selectedOptions) => {
    setValue(selectedOptions); // Seçilen değerleri state'e kaydediyoruz
  };

  // Seçenekleri formatlama
  const formatOptionLabel = (option, { context, inputValue }) => {
    if (context === "menu") {
      const start = option.label
        .toLowerCase()
        .indexOf(inputValue.toLowerCase());
      const end = start + inputValue.length;

      // Kelimenin öncesi, eşleşen kısım ve sonrası olarak bölüyoruz
      const boldPart = option.label.slice(start, end);
      const beforePart = option.label.slice(0, start);
      const afterPart = option.label.slice(end);

      return (
        <div className="flex gap-3 p-2   ">
          <img
            className="w-[40px] rounded-lg"
            src={option.image}
            alt={option.label}
          />
          <div>
            {beforePart}
            <strong>{boldPart}</strong> {/* Eşleşen kısmı kalın yazıyoruz */}
            {afterPart}
            <p className="text-gray-400">{option.episodes} Episodes</p>
          </div>
        </div>
      );
    }
    // Seçenek seçildiğinde sadece ismin görüntülenmesini sağlıyoruz
    return option.label;
  };

  return (
    <div className="flex justify-center  m-w-[600px]">
      <div>
        <Select
          value={value}
          onChange={handleChange}
          placeholder="Bir karakter seçiniz.."
          isMulti
          options={options}
          closeMenuOnSelect={false}
          components={{ Option: CheckboxOption }}
          formatOptionLabel={formatOptionLabel}
          className="w-[600px] mt-10 "
        />
      </div>
    </div>
  );
};

export default Input;
