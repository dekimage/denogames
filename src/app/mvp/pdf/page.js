// "use client";
// import React from "react";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   PDFDownloadLink,
// } from "@react-pdf/renderer";
// import { StyleSheet } from "@react-pdf/renderer";

// // Define styles using react-pdf's StyleSheet
// const styles = StyleSheet.create({
//   page: {
//     padding: 10,
//     backgroundColor: "#ffffff",
//   },
//   table: {
//     display: "table",
//     width: "auto",
//     margin: "0 auto",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: "#000",
//   },
//   tableRow: {
//     flexDirection: "row",
//   },
//   tableCell: {
//     borderStyle: "solid",
//     borderWidth: 1,
//     padding: 10,
//     textAlign: "center",
//   },
//   image: {
//     width: 50,
//     height: 50,
//     margin: "0 auto",
//   },
//   dottedCircle: {
//     borderWidth: 1,
//     borderColor: "#000",
//     borderRadius: "50%",
//     width: 20,
//     height: 20,
//     margin: "0 auto",
//     borderStyle: "dotted",
//   },
// });

// const MyDocument = () => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.table}>
//         {/* Table Row 1 */}
//         <View style={styles.tableRow}>
//           <View style={styles.tableCell}>
//             <Text>1</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <Text>2</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <Text>3</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <View style={styles.dottedCircle}></View>
//           </View>
//         </View>
//         {/* Table Row 2 */}
//         <View style={styles.tableRow}>
//           <View style={styles.tableCell}>
//             <Text>4</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <Text>5</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <Text>6</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <View style={styles.dottedCircle}></View>
//           </View>
//         </View>
//         {/* Add more rows as necessary */}
//       </View>
//     </Page>
//   </Document>
// );

// const PDFGenerator = () => (
//   <div className="flex justify-center mt-8">
//     <PDFDownloadLink document={<MyDocument />} fileName="generated.pdf">
//       {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
//     </PDFDownloadLink>
//   </div>
// );

const PDFGenerator = () => {
  return <div>PDFGenerator</div>;
};

export default PDFGenerator;
