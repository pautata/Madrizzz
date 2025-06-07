import React, { useState, useMemo, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Linking} from 'react-native';
import Constants from 'expo-constants';

const diasSemana = [
  'DOMINGO',
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO'
];

export default function FavoritesScreen({navigation, favorites, onRemove, onClear}) {
  const [dayWindow, setDayWindow] = useState('hoy')
  // 0 = domingo, 1 = lunes … 6 = sábado
  const hoyIndice = new Date().getDay()
  const mananaIndice = (hoyIndice + 1) % 7 // si es (6+7)/7 el resto es 0, así que sabe que es domingo


  useEffect(function () {
    console.log('Favoritos actuales:', favorites);
  }, [favorites]);

  var favoritosPorDia = useMemo(
    function () {
      var grupos = { hoy: [], manana: [], prox: [] };

      for (var i = 0; i < favorites.length; i++) {
        var plan = favorites[i];

        
        var listaDeDiasUnicos = [];
        if (Array.isArray(plan.horarios)) {
          var auxiliarParaUnicos = {};
          for (var j = 0; j < plan.horarios.length; j++) {
            var h = plan.horarios[j];

            
            var diaOriginal;
            if (h.diaInicio !== undefined && h.diaInicio !== null) {
              diaOriginal = h.diaInicio;
            } else {
              diaOriginal = h.dia;
            }

            
            var diaEnMayusculas;
            if (diaOriginal !== undefined && diaOriginal !== null) {
              diaEnMayusculas = String(diaOriginal).toUpperCase();
            } else {
              diaEnMayusculas = '';
            }

            if (diaEnMayusculas !== '') {
              auxiliarParaUnicos[diaEnMayusculas] = true;
            }
          }

          for (var clave in auxiliarParaUnicos) {
            if (auxiliarParaUnicos.hasOwnProperty(clave)) {
              listaDeDiasUnicos.push(clave);
            }
          }
        } else {

          listaDeDiasUnicos = [];
        }

        var vistos = {};
        for (var k = 0; k < listaDeDiasUnicos.length; k++) {
          var diaActual = listaDeDiasUnicos[k];

          var idx = -1;
          for (var m = 0; m < diasSemana.length; m++) {
            if (diasSemana[m] === diaActual) {
              idx = m;
              break;
            }
          }

          if (idx === hoyIndice && !vistos['hoy']) {
            grupos.hoy.push(plan);
            vistos['hoy'] = true;
          } else if (idx === mananaIndice && !vistos['manana']) {
            grupos.manana.push(plan);
            vistos['manana'] = true;
          } else if (
            idx !== hoyIndice &&
            idx !== mananaIndice &&
            !vistos['prox']
          ) {
            grupos.prox.push(plan);
            vistos['prox'] = true;
          }
        }
      }

      console.log('Grupos de favoritos:', grupos);
      return grupos;
    },
    [favorites, hoyIndice, mananaIndice]
  );


  function renderPlan(itemObject) {
    var item = itemObject.item;


    var url;
    if (item.url !== undefined && item.url !== null && item.url !== '') {
      url = item.url;
    } else if (
      item.imagenUrl !== undefined &&
      item.imagenUrl !== null &&
      item.imagenUrl !== ''
    ) {
      url = item.imagenUrl;
    } else {
      url = '#';
    }

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text>
          {item.localizacion} · {item.precio.toFixed(2)} €
        </Text>
        <View style={styles.cardButtons}>
          <TouchableOpacity
            onPress={function () {
              Linking.openURL(url);
            }}
          >
            <Text style={styles.link}>Abrir web</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={function () {
              navigation.navigate('Detail', { plan: item });
            }}
          >
            <Text style={styles.link}>Detalle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={function () {
              onRemove(item.id);
            }}
          >
            <Text style={[styles.link, { color: 'red' }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  var pestañas = [];
  var etiquetas = ['hoy', 'manana', 'prox'];
  for (var p = 0; p < etiquetas.length; p++) {
    var t = etiquetas[p];
    var textoEtiqueta;
    if (t === 'hoy') {
      textoEtiqueta = 'Hoy';
    } else if (t === 'manana') {
      textoEtiqueta = 'Mañana';
    } else {
      textoEtiqueta = 'Próximos días';
    }

    var estiloTab = styles.tab;
    var estiloTexto = styles.tabText;
    if (dayWindow === t) {
      estiloTab = [styles.tab, styles.tabActive];
      estiloTexto = styles.tabTextActive;
    }

    pestañas.push(
      <TouchableOpacity
        key={t}
        onPress={(function (valor) {
          return function () {
            setDayWindow(valor);
          };
        })(t)}
        style={estiloTab}
      >
        <Text style={estiloTexto}>{textoEtiqueta}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
   
      <View style={styles.header}>{pestañas}</View>

      <FlatList
        style={styles.list}
        data={favoritosPorDia[dayWindow]}
        keyExtractor={function (item) {
          return String(item.id);
        }}
        renderItem={renderPlan}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay favoritos aquí.</Text>
        }
      />

      {/* Footer fijo */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={function () {
            onClear();
          }}
          style={styles.footerBtn}
        >
          <Text>Vaciar favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={function () {
            navigation.goBack();
          }}
          style={styles.footerBtn}
        >
          <Text>Seguir eligiendo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Constants.statusBarHeight },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: 'white',
    elevation: 4,
    paddingTop: 15
  },
  tab: { padding: 8 },
  tabActive: { borderBottomWidth: 2, borderColor: '#64EDCC' },
  tabText: { color: '#555' },
  tabTextActive: { color: '#64EDCC', fontWeight: 'bold' },

  list: { flex: 1, padding: 10 },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    elevation: 2
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  link: { textDecorationLine: 'underline' },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: 'white',
    elevation: 4
  },
  footerBtn: { padding: 10 }
});